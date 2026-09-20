/**
 * Handle product order intents.
 * Searches for the product in the shared data, shows confirmation, adds to WhatsApp cart.
 */

import { sendTextMessage, sendInteractiveButtons } from '../sendMessage';
import { updateSession } from '../sessionManager';
import { vegetables, fruits, PREPARATION_LABELS, PreparationType } from '@/lib/data';

interface OrderItem {
    productName: string;
    weightGrams: number;
    prep: string | null;
}

export async function handleProductOrder(phone: string, items: OrderItem[]) {
    if (!items || items.length === 0) {
        await sendTextMessage(phone, 'Sorry, I could not understand your order. Please try again.\n\nExample: *1kg diced potato*');
        return;
    }

    const allProducts = [...vegetables, ...fruits];
    const resolved: unknown[] = [];
    const notFound: string[] = [];

    for (const item of items) {
        const product = allProducts.find(p =>
            p.name.toLowerCase().includes(item.productName.toLowerCase()) ||
            item.productName.toLowerCase().includes(p.name.toLowerCase().split(' ')[0])
        );

        if (!product) {
            notFound.push(item.productName);
            continue;
        }

        // Find best variant
        const targetPrep = (item.prep ?? 'WHOLE') as PreparationType;
        const variant = product.variants.find(
            v => v.preparationType === targetPrep && v.weight === item.weightGrams && v.isAvailable
        ) ?? product.variants.find(v => v.isAvailable);

        if (!variant) {
            notFound.push(product.name);
            continue;
        }

        resolved.push({
            productId: product.id,
            productName: product.name,
            emoji: product.emoji,
            variantId: variant.id ?? `${product.id}_${variant.preparationType}_${variant.weight}`,
            preparationType: variant.preparationType,
            weight: variant.weight,
            price: variant.price,
        });
    }

    if (resolved.length === 0) {
        await sendTextMessage(phone,
            `Sorry, I couldn't find: *${notFound.join(', ')}*\n\nTry a different name? Example:\n• "1kg aloo"\n• "500g diced tomato"`
        );
        return;
    }

    // Format confirmation message
    const lines = (resolved as any[]).map(r =>
        `${r.emoji} *${r.productName}*\n` +
        `   Prep: ${PREPARATION_LABELS[r.preparationType as PreparationType]}\n` +
        `   Qty: ${r.weight >= 1000 ? `${r.weight / 1000}kg` : `${r.weight}g`}\n` +
        `   Price: ₹${r.price}`
    ).join('\n\n');

    const total = (resolved as any[]).reduce((s, r) => s + r.price, 0);

    // Store pending items in session
    await updateSession(phone, { state: 'AWAITING_CART_CONFIRM', pendingItems: resolved });

    await sendInteractiveButtons(
        phone,
        `🛒 *Add to Cart?*\n\n${lines}\n\n*Total: ₹${total}*`,
        [
            { id: 'add_to_cart_confirm', title: '✅ Add to Cart' },
            { id: 'cancel_order', title: '❌ Cancel' },
        ]
    );

    if (notFound.length > 0) {
        await sendTextMessage(phone, `⚠️ Could not find: *${notFound.join(', ')}*. Continuing with available items.`);
    }
}

export async function addPendingToCart(phone: string) {
    // This is called after customer confirms — adds to WhatsApp cart DB
    try {
        const { default: prisma } = await import('@/lib/prismaClient');
        const { getSession, updateSession } = await import('../sessionManager');
        const session = await getSession(phone);
        const items = session.pendingItems as any[] ?? [];

        if (items.length === 0) {
            await sendTextMessage(phone, 'No items to add. Please try ordering again.');
            return;
        }

        // Get existing WhatsApp cart
        const existingCart = await (prisma as any).whatsAppCart.findUnique({ where: { phoneNumber: phone } });
        const existingItems: any[] = existingCart?.items ?? [];

        // Merge items
        for (const newItem of items) {
            const existingIndex = existingItems.findIndex(
                e => e.productId === newItem.productId && e.preparationType === newItem.preparationType && e.weight === newItem.weight
            );
            if (existingIndex >= 0) {
                existingItems[existingIndex].quantity += 1;
            } else {
                existingItems.push({ ...newItem, quantity: 1 });
            }
        }

        await (prisma as any).whatsAppCart.upsert({
            where: { phoneNumber: phone },
            create: { phoneNumber: phone, items: existingItems },
            update: { items: existingItems }
        });

        await updateSession(phone, { state: 'MENU', pendingItems: [] });

        const itemNames = items.map((i: any) => `${i.emoji} ${i.productName}`).join(', ');
        await sendInteractiveButtons(
            phone,
            `✅ *Added to cart!*\n\n${itemNames}\n\nWhat would you like to do next?`,
            [
                { id: 'view_cart', title: '🛒 View Cart' },
                { id: 'checkout', title: '✅ Checkout' },
                { id: 'continue_shopping', title: '🥕 Continue Shopping' },
            ]
        );
    } catch (e) {
        console.error('[WhatsApp] addPendingToCart error:', e);
        await sendTextMessage(phone, 'Sorry, there was an error. Please try again.');
    }
}
