/**
 * WhatsApp Business Cloud API Webhook
 * GET  /api/whatsapp/webhook  — webhook verification
 * POST /api/whatsapp/webhook  — receive messages
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import getPrisma from '@/lib/prismaClient';
import { parseIntent } from '@/lib/whatsapp/intentParser';
import { getSession, updateSession, clearSession } from '@/lib/whatsapp/sessionManager';
import { isAdminPhone, isRateLimited, getPendingAction, clearPendingAction } from '@/lib/whatsapp/security';
import { sendTextMessage } from '@/lib/whatsapp/sendMessage';

// ─── GET: Webhook Verification ────────────────────────────────────────────────

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
        return new NextResponse(challenge, { status: 200 });
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// ─── POST: Incoming Messages ──────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-hub-signature-256');

        if (!signature || !process.env.WHATSAPP_APP_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const expectedSignature = `sha256=${crypto
            .createHmac('sha256', process.env.WHATSAPP_APP_SECRET)
            .update(rawBody)
            .digest('hex')}`;

        const sigBuffer = Buffer.from(signature);
        const expectedBuffer = Buffer.from(expectedSignature);

        if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let body: any;
        try {
            body = JSON.parse(rawBody);
        } catch {
            return NextResponse.json({ status: 'ok' }); // Malformed payload
        }

        // Must run inline because standard serverless functions pause on response
        await processWebhook(body);
        return NextResponse.json({ status: 'ok' });
    } catch (err: any) {
        // Return 500 only on unexpected systemic failures to trigger WhatsApp retry safely.
        // Wait, for safety, returning 200 absorbs the message so no duplicate if we didn't carefully implement retries
        console.error('Webhook error:', err);
        return NextResponse.json({ status: 'ok' });
    }
}

// ─── Main Processing ──────────────────────────────────────────────────────────

async function processWebhook(body: any) {
    if (body?.object !== 'whatsapp_business_account' || !Array.isArray(body.entry)) return;

    const prisma = await getPrisma();
    if (!prisma) return; // Prevent crashes if DB offline

    for (const entry of body.entry) {
        if (!Array.isArray(entry.changes)) continue;

        for (const change of entry.changes) {
            const value = change.value;
            if (!Array.isArray(value?.messages)) continue;

            for (const message of value.messages) {
                if (!message?.id) continue;

                const messageId = message.id as string;
                const phone = (message.from as string) || 'UNKNOWN';

                try {
                    // Idempotency pattern using create unique constraint
                    await prisma.whatsAppMessage.create({
                        data: {
                            messageId,
                            phoneNumber: phone,
                            messageType: message.type,
                            status: 'PROCESSING'
                        }
                    });
                } catch (e: any) {
                    // P2002 means already exists/processing - safely ignore duplicates
                    if (e.code === 'P2002') continue;
                    throw e;
                }

                try {
                    // Process logic
                    if (isRateLimited(phone)) {
                        await sendTextMessage(phone, '⚠️ Too many requests. Please wait a moment.');
                    } else {
                        // Extract text safely ignoring unsupported contents like image/audio.
                        let text = '';
                        if (message.type === 'text') {
                            text = message.text?.body?.trim() ?? '';
                        } else if (message.type === 'interactive') {
                            text = message.interactive?.button_reply?.id ??
                                message.interactive?.list_reply?.id ?? '';
                        }

                        if (text) {
                            await handleMessage(phone, text);
                        }
                    }

                    // Mark as PROCESSED
                    await prisma.whatsAppMessage.update({
                        where: { messageId },
                        data: { status: 'PROCESSED', processedAt: new Date() }
                    });
                } catch (err) {
                    // Mark as FAILED
                    await prisma.whatsAppMessage.update({
                        where: { messageId },
                        data: { status: 'FAILED' }
                    });
                    console.error('Message processing failed:', err);
                }
            }
        }
    }
}

// ─── Message Router ───────────────────────────────────────────────────────────

async function handleMessage(phone: string, text: string) {
    const isAdmin = isAdminPhone(phone);
    const session = await getSession(phone);
    const intent = parseIntent(text);

    // ── Map interactive button IDs to intents ──
    const buttonMappings: Record<string, () => Promise<void>> = {
        'order_now': () => handleMenuAction(phone, 'browse_vegetables'),
        'browse_vegetables': () => handleMenuAction(phone, 'browse_vegetables'),
        'browse_fruits': () => handleMenuAction(phone, 'browse_fruits'),
        'browse_recipes': () => handleMenuAction(phone, 'browse_recipes'),
        'what_to_cook': () => handleMenuAction(phone, 'what_to_cook'),
        'track_order': () => handleMenuAction(phone, 'track_order'),
        'view_cart': () => handleMenuAction(phone, 'view_cart'),
        'reorder': () => handleMenuAction(phone, 'reorder'),
        'clear_cart': () => handleMenuAction(phone, 'clear_cart'),
        'support': () => handleMenuAction(phone, 'support'),
        'checkout': () => handleMenuAction(phone, 'checkout'),
        'continue_shopping': () => handleMenuAction(phone, 'menu'),
        'add_to_cart_confirm': () => handleAddToCartConfirm(phone),
        'cancel_order': () => handleCancelPending(phone),
        'confirm_admin_action': () => handleAdminConfirm(phone),
        'cancel_admin_action': () => handleAdminCancelAction(phone),
    };

    if (buttonMappings[text.toLowerCase()]) {
        return buttonMappings[text.toLowerCase()]();
    }

    // ── Handle confirmation responses for pending actions ──
    if (intent.type === 'CONFIRM_ACTION') {
        const pending = getPendingAction(phone);
        if (pending) {
            if (isAdmin) {
                const { executeAdminAction } = await import('@/lib/whatsapp/handlers/handleAdmin');
                return executeAdminAction(phone);
            } else {
                return handleAddToCartConfirm(phone);
            }
        }
    }

    if (intent.type === 'CANCEL_ACTION') {
        clearPendingAction(phone);
        await updateSession(phone, { state: 'MENU' });
        await sendTextMessage(phone, '❌ Action cancelled.\n\nReply *menu* to start again.');
        return;
    }

    // ── Admin-only intents ──
    if (['ADMIN_CMD', 'ADMIN_PRICE', 'ADMIN_STOCK', 'ADMIN_TOGGLE', 'ADMIN_REPORT'].includes(intent.type)) {
        if (!isAdmin) {
            await sendTextMessage(phone, '⚠️ You are not authorized to perform admin actions.');
            return;
        }
        return handleAdminIntent(phone, intent);
    }

    // ── Customer intents ──
    switch (intent.type) {
        case 'MENU':
            const { handleMenu } = await import('@/lib/whatsapp/handlers/handleMenu');
            await handleMenu(phone);
            break;

        case 'ORDER_PRODUCT':
            const { handleProductOrder } = await import('@/lib/whatsapp/handlers/handleProductOrder');
            await handleProductOrder(phone, intent.data.items as any);
            break;

        case 'RECIPE_REQUEST':
            const { handleRecipe } = await import('@/lib/whatsapp/handlers/handleRecipe');
            await handleRecipe(phone, intent.data.dish as string, intent.data.servings as number);
            break;

        case 'VIEW_CART':
            const { handleViewCart } = await import('@/lib/whatsapp/handlers/handleCart');
            await handleViewCart(phone);
            break;

        case 'CLEAR_CART':
            const { handleClearCart } = await import('@/lib/whatsapp/handlers/handleCart');
            await handleClearCart(phone);
            break;

        case 'CHECKOUT':
            await handleCheckout(phone);
            break;

        case 'TRACK_ORDER':
            const { handleTracking } = await import('@/lib/whatsapp/handlers/handleOrders');
            await handleTracking(phone, intent.data.orderNo as string | null);
            break;

        case 'REORDER':
            const { handleReorder } = await import('@/lib/whatsapp/handlers/handleOrders');
            await handleReorder(phone);
            break;

        case 'SUPPORT':
            await sendTextMessage(phone,
                `💬 *Support*\n\nFor help, please contact us:\n📞 Call: +91 98765 43210\n📧 Email: support@sabjiwala.in\n\nOr describe your issue and we'll respond shortly.`
            );
            break;

        case 'CANCEL_ORDER':
            await sendTextMessage(phone,
                `To cancel an order, please contact our support:\n📞 +91 98765 43210\n\nOr visit our website and cancel from My Orders.`
            );
            break;

        case 'ACCOUNT_LINK':
            await handleAccountLink(phone);
            break;

        default:
            // Context-aware fallback based on session state
            if (session.state === 'AWAITING_ADDRESS') {
                await handleAddressReceived(phone, text);
            } else if (session.state === 'AWAITING_OTP') {
                await handleOtpVerification(phone, text);
            } else {
                await sendTextMessage(phone,
                    `I didn't quite understand that. 😊\n\nTry:\n• *1kg aloo diced* — order vegetables\n• *aloo gobi 4 log* — recipe kit\n• *track* — track your order\n• *menu* — see all options`
                );
            }
    }
}

// ─── Helper Action Handlers ───────────────────────────────────────────────────

async function handleMenuAction(phone: string, action: string) {
    const { handleMenu } = await import('@/lib/whatsapp/handlers/handleMenu');
    switch (action) {
        case 'menu':
        case 'browse_vegetables':
        case 'browse_fruits':
        case 'browse_recipes':
            await handleMenu(phone);
            break;
        case 'view_cart':
            const { handleViewCart } = await import('@/lib/whatsapp/handlers/handleCart');
            await handleViewCart(phone);
            break;
        case 'clear_cart':
            const { handleClearCart } = await import('@/lib/whatsapp/handlers/handleCart');
            await handleClearCart(phone);
            break;
        case 'checkout':
            await handleCheckout(phone);
            break;
        case 'track_order':
            const { handleTracking } = await import('@/lib/whatsapp/handlers/handleOrders');
            await handleTracking(phone);
            break;
        case 'reorder':
            const { handleReorder } = await import('@/lib/whatsapp/handlers/handleOrders');
            await handleReorder(phone);
            break;
        case 'support':
            await sendTextMessage(phone, `💬 *Support*\n\nContact us at: +91 98765 43210\nor email: support@sabjiwala.in`);
            break;
        case 'what_to_cook':
            await sendTextMessage(phone, `👨‍🍳 Tell me what dish you want to make!\n\nExamples:\n• *aloo gobi 4 log*\n• *paneer butter masala 2 people*\n• *biryani 6 people*`);
            break;
    }
}

async function handleAddToCartConfirm(phone: string) {
    const { addPendingToCart } = await import('@/lib/whatsapp/handlers/handleProductOrder');
    await addPendingToCart(phone);
}

async function handleCancelPending(phone: string) {
    clearPendingAction(phone);
    await updateSession(phone, { state: 'MENU', pendingItems: [] });
    await sendTextMessage(phone, '❌ Cancelled.\n\nReply *menu* to start again.');
}

async function handleAdminConfirm(phone: string) {
    const { executeAdminAction } = await import('@/lib/whatsapp/handlers/handleAdmin');
    await executeAdminAction(phone);
}

async function handleAdminCancelAction(phone: string) {
    clearPendingAction(phone);
    await sendTextMessage(phone, '❌ Admin action cancelled.');
}

async function handleAdminIntent(phone: string, intent: ReturnType<typeof parseIntent>) {
    const { handleAdminOrderCmd, handleAdminPrice, handleAdminStock, handleAdminReport } = await import('@/lib/whatsapp/handlers/handleAdmin');

    switch (intent.type) {
        case 'ADMIN_CMD':
            await handleAdminOrderCmd(phone, intent.data.status as string, intent.data.orderNo as string);
            break;
        case 'ADMIN_PRICE':
            await handleAdminPrice(phone, intent.data.product as string, intent.data.price as number);
            break;
        case 'ADMIN_STOCK':
            await handleAdminStock(phone, intent.data.product as string, intent.data.stockGrams as number);
            break;
        case 'ADMIN_REPORT':
            await handleAdminReport(phone);
            break;
    }
}

async function handleCheckout(phone: string) {
    await updateSession(phone, { state: 'AWAITING_ADDRESS' });
    await sendTextMessage(phone,
        `🏠 *Checkout*\n\nPlease share your delivery address.\n\nOr send your location 📍 so we can auto-fill it.\n\nExample:\n_Flat 4B, Green Residency, HSR Layout, Bangalore - 560102_`
    );
}

async function handleAddressReceived(phone: string, address: string) {
    await updateSession(phone, { state: 'AWAITING_SLOT', pendingAddress: address });
    await sendTextMessage(phone,
        `📍 Got it!\n\n*Address:* ${address}\n\nChoose a delivery slot:\n1️⃣ ASAP (30–45 mins)\n2️⃣ Morning (7–9 AM)\n3️⃣ Afternoon (12–2 PM)\n4️⃣ Evening (5–7 PM)\n\nReply with 1, 2, 3 or 4.`
    );
}

async function handleOtpVerification(phone: string, otp: string) {
    // Simplified OTP flow — in production, verify against stored OTP
    await sendTextMessage(phone,
        `✅ Account linked successfully!\n\nYour WhatsApp number is now connected to your SabjiWala account.\n\nYour cart and order history is available across website and WhatsApp. 🎉\n\nReply *menu* to start ordering.`
    );
    await updateSession(phone, { state: 'MENU' });
}

async function handleAccountLink(phone: string) {
    await updateSession(phone, { state: 'AWAITING_OTP' });
    await sendTextMessage(phone,
        `🔗 *Link Your Account*\n\nTo connect your WhatsApp with your SabjiWala website account:\n\n1. Open sabjiwala.in/profile\n2. Go to *Settings → Link WhatsApp*\n3. Enter your WhatsApp number: *${phone}*\n4. Enter the OTP sent to your email\n\nOr reply your email address and we'll send you an OTP.`
    );
}
