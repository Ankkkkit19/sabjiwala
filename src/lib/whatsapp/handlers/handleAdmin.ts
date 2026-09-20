/**
 * Admin command handlers — order status updates, price changes, stock updates
 * All admin actions go through a confirmation flow before DB writes.
 */

import { sendTextMessage, sendInteractiveButtons } from '../sendMessage';
import { storePendingAction, getPendingAction, clearPendingAction } from '../security';

// ─── Order Status Updates ──────────────────────────────────────────────────────

export async function handleAdminOrderCmd(phone: string, status: string, orderNo: string) {
    try {
        const { default: prisma } = await import('@/lib/prismaClient');

        // Find the order by shortId (last 6 chars of cuid)
        const allOrders = await (prisma as any).order.findMany({
            orderBy: { createdAt: 'desc' },
            take: 500,
            include: { user: true }
        });

        const order = allOrders.find((o: any) => o.id.slice(-6).toUpperCase() === orderNo.replace('SW', ''));

        if (!order) {
            await sendTextMessage(phone, `❌ Order *${orderNo}* not found.`);
            return;
        }

        // Store pending action for confirmation
        storePendingAction(phone, 'UPDATE_ORDER_STATUS', { orderId: order.id, status, orderNo, customerPhone: order.user?.phone });

        await sendInteractiveButtons(
            phone,
            `⚠️ *Confirm Status Update*\n\nOrder: *${orderNo}*\nNew Status: *${status.replace(/_/g, ' ')}*\n\nCustomer: ${order.user?.name ?? 'Unknown'}`,
            [
                { id: 'confirm_admin_action', title: '✅ Confirm' },
                { id: 'cancel_admin_action', title: '❌ Cancel' },
            ]
        );
    } catch (e) {
        console.error('[WhatsApp] handleAdminOrderCmd error:', e);
        await sendTextMessage(phone, 'Error finding order. Please try again.');
    }
}

// ─── Execute confirmed admin action ───────────────────────────────────────────

export async function executeAdminAction(phone: string) {
    const pending = getPendingAction(phone);
    if (!pending) {
        await sendTextMessage(phone, 'No pending action to confirm. Please start again.');
        return;
    }

    clearPendingAction(phone);

    try {
        const { default: prisma } = await import('@/lib/prismaClient');

        if (pending.action === 'UPDATE_ORDER_STATUS') {
            const { orderId, status, orderNo, customerPhone } = pending.payload as any;
            await (prisma as any).order.update({
                where: { id: orderId },
                data: { orderStatus: status }
            });

            await sendTextMessage(phone, `✅ Order *${orderNo}* updated to: *${status.replace(/_/g, ' ')}*`);

            // Notify customer if phone available
            if (customerPhone) {
                const { notifyCustomerPreparing, notifyCustomerPacked, notifyCustomerOutForDelivery, notifyCustomerDelivered } = await import('../notifications');
                if (status === 'PREPARING') await notifyCustomerPreparing(customerPhone, orderId);
                if (status === 'PACKED') await notifyCustomerPacked(customerPhone, orderId);
                if (status === 'OUT_FOR_DELIVERY') await notifyCustomerOutForDelivery(customerPhone, orderId);
                if (status === 'DELIVERED') await notifyCustomerDelivered(customerPhone, orderId);
            }

            // Write audit log
            await writeAuditLog(phone, 'UPDATE_ORDER_STATUS', pending.payload);
        }

        if (pending.action === 'UPDATE_PRICE') {
            const { productId, price, productName, oldPrice } = pending.payload as any;
            // Find product variant and update price
            // In real app: update ProductVariant.price. Using a simple approach here:
            await (prisma as any).productVariant.updateMany({
                where: { productId },
                data: { price }
            });
            await sendTextMessage(phone, `✅ *${productName}* price updated: ₹${oldPrice} → ₹${price}`);
            await writeAuditLog(phone, 'UPDATE_PRICE', pending.payload);
        }

        if (pending.action === 'UPDATE_STOCK') {
            const { productId, stockKg, productName } = pending.payload as any;
            await (prisma as any).inventory.upsert({
                where: { productId },
                create: { productId, rawStock: stockKg, preparedStock: 0 },
                update: { rawStock: stockKg }
            });
            await sendTextMessage(phone, `✅ *${productName}* stock updated to: ${stockKg}kg`);
            await writeAuditLog(phone, 'UPDATE_STOCK', pending.payload);
        }

        if (pending.action === 'TOGGLE_PRODUCT') {
            const { productId, enabled, productName } = pending.payload as any;
            await (prisma as any).product.update({
                where: { id: productId },
                data: { isAvailable: enabled }
            });
            await sendTextMessage(phone, `✅ *${productName}* has been *${enabled ? 'enabled' : 'disabled'}*.`);
            await writeAuditLog(phone, 'TOGGLE_PRODUCT', pending.payload);
        }
    } catch (e) {
        console.error('[WhatsApp] executeAdminAction error:', e);
        await sendTextMessage(phone, '❌ Failed to execute action. Please try again.');
    }
}

// ─── Price Update ──────────────────────────────────────────────────────────────

export async function handleAdminPrice(phone: string, productSearch: string, newPrice: number) {
    try {
        const { default: prisma } = await import('@/lib/prismaClient');
        const product = await (prisma as any).product.findFirst({
            where: {
                name: { contains: productSearch, mode: 'insensitive' }
            },
            include: { variants: { take: 1 } }
        });

        if (!product) {
            await sendTextMessage(phone, `❌ Product *"${productSearch}"* not found in database.`);
            return;
        }

        const currentPrice = product.variants[0]?.price ?? product.basePrice;
        storePendingAction(phone, 'UPDATE_PRICE', {
            productId: product.id,
            productName: product.name,
            price: newPrice,
            oldPrice: currentPrice
        });

        await sendInteractiveButtons(
            phone,
            `⚠️ *Confirm Price Change*\n\n🥔 *${product.name}*\nCurrent price: ₹${currentPrice}\nNew price: ₹${newPrice}`,
            [
                { id: 'confirm_admin_action', title: '✅ Confirm' },
                { id: 'cancel_admin_action', title: '❌ Cancel' },
            ]
        );
    } catch (e) {
        await sendTextMessage(phone, 'Error updating price. Please try again.');
    }
}

// ─── Stock Update ──────────────────────────────────────────────────────────────

export async function handleAdminStock(phone: string, productSearch: string, stockGrams: number) {
    try {
        const { default: prisma } = await import('@/lib/prismaClient');
        const product = await (prisma as any).product.findFirst({
            where: {
                name: { contains: productSearch, mode: 'insensitive' }
            },
            include: { inventory: true }
        });

        if (!product) {
            await sendTextMessage(phone, `❌ Product *"${productSearch}"* not found.`);
            return;
        }

        const stockKg = stockGrams / 1000;
        storePendingAction(phone, 'UPDATE_STOCK', {
            productId: product.id,
            productName: product.name,
            stockKg,
            currentStock: product.inventory?.rawStock ?? 0
        });

        await sendInteractiveButtons(
            phone,
            `⚠️ *Confirm Stock Update*\n\n🥔 *${product.name}*\nCurrent stock: ${product.inventory?.rawStock ?? 0}kg\nNew stock: ${stockKg}kg`,
            [
                { id: 'confirm_admin_action', title: '✅ Confirm' },
                { id: 'cancel_admin_action', title: '❌ Cancel' },
            ]
        );
    } catch (e) {
        await sendTextMessage(phone, 'Error updating stock. Please try again.');
    }
}

// ─── Daily Report ──────────────────────────────────────────────────────────────

export async function handleAdminReport(phone: string) {
    try {
        const { default: prisma } = await import('@/lib/prismaClient');
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const orders = await (prisma as any).order.findMany({
            where: { createdAt: { gte: startOfDay } },
            include: { items: true }
        });

        const totalOrders = orders.length;
        const revenue = orders.reduce((s: number, o: any) => s + o.total, 0);
        const avgOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;

        const statusCounts = orders.reduce((acc: any, o: any) => {
            acc[o.orderStatus] = (acc[o.orderStatus] ?? 0) + 1;
            return acc;
        }, {});

        // Top product
        const productCounts: Record<string, number> = {};
        for (const order of orders) {
            for (const item of order.items) {
                productCounts[item.name] = (productCounts[item.name] ?? 0) + 1;
            }
        }
        const topProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';

        const { sendDailyReport } = await import('../notifications');
        await sendDailyReport(phone, {
            totalOrders,
            revenue,
            avgOrderValue,
            pending: statusCounts['PENDING'] ?? 0,
            preparing: statusCounts['PREPARING'] ?? 0,
            outForDelivery: statusCounts['OUT_FOR_DELIVERY'] ?? 0,
            delivered: statusCounts['DELIVERED'] ?? 0,
            cancelled: statusCounts['CANCELLED'] ?? 0,
            topProduct,
            topRecipe: 'N/A'
        });
    } catch (e) {
        await sendTextMessage(phone, 'Error generating report. Please try again.');
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function writeAuditLog(adminPhone: string, action: string, metadata: Record<string, unknown>) {
    try {
        const { default: prisma } = await import('@/lib/prismaClient');
        await (prisma as any).whatsAppAuditLog.create({
            data: { adminPhone, action, metadata }
        });
    } catch (e) {
        console.warn('[WhatsApp] Could not write audit log:', e);
    }
}
