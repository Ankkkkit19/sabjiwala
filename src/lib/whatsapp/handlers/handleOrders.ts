import { sendTextMessage, sendInteractiveButtons } from '../sendMessage';
import { updateSession } from '../sessionManager';

export async function handleTracking(phone: string, orderNo?: string | null) {
    try {
        const { default: prisma } = await import('@/lib/prismaClient');

        // Find order by short ID or customer's latest order
        let order: any = null;

        if (orderNo) {
            // Strip "SW" prefix and search by last 6 chars of cuid
            const allOrders = await (prisma as any).order.findMany({
                where: {},
                orderBy: { createdAt: 'desc' },
                take: 200,
                include: { address: true }
            });
            order = allOrders.find((o: any) => o.id.slice(-6).toUpperCase() === orderNo.replace('SW', ''));
        }

        // If no specific order or not found, get the linked user's latest order
        if (!order) {
            const session = await (await import('../sessionManager')).getSession(phone);
            if (session.userId) {
                order = await (prisma as any).order.findFirst({
                    where: { userId: session.userId },
                    orderBy: { createdAt: 'desc' },
                    include: { address: true }
                });
            }
        }

        if (!order) {
            await sendTextMessage(phone,
                `📦 No orders found.\n\nIf you placed an order recently, please link your account first by replying *link account*.\n\nOr reply your order number like: *track SW123456*`
            );
            return;
        }

        const shortId = order.id.slice(-6).toUpperCase();

        const STATUS_STEPS = [
            { key: 'PENDING', label: 'Order Received', emoji: '📨' },
            { key: 'CONFIRMED', label: 'Confirmed', emoji: '✅' },
            { key: 'PREPARING', label: 'Preparing', emoji: '🔪' },
            { key: 'PACKED', label: 'Packed', emoji: '📦' },
            { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', emoji: '🛵' },
            { key: 'DELIVERED', label: 'Delivered', emoji: '🎉' },
        ];

        const currentIndex = STATUS_STEPS.findIndex(s => s.key === order.orderStatus);

        const timeline = STATUS_STEPS.map((step, i) => {
            if (i < currentIndex) return `✓ ${step.label}`;
            if (i === currentIndex) return `● *${step.label}* ← You are here`;
            return `○ ${step.label}`;
        }).join('\n');

        await sendTextMessage(phone,
            `📦 *Order #SW${shortId}*\n\n${timeline}\n\n${currentIndex < 4 ? '_Estimated delivery: 30–45 minutes_' : ''}`
        );
    } catch (e) {
        console.error('[WhatsApp] handleTracking error:', e);
        await sendTextMessage(phone, 'Could not fetch order status. Please try again.');
    }
}

export async function handleReorder(phone: string) {
    try {
        const { default: prisma } = await import('@/lib/prismaClient');
        const session = await (await import('../sessionManager')).getSession(phone);

        if (!session.userId) {
            await sendTextMessage(phone, '⚠️ Please link your account first.\n\nReply *link account* to connect your website account.');
            return;
        }

        const lastOrder = await (prisma as any).order.findFirst({
            where: { userId: session.userId, orderStatus: { not: 'CANCELLED' } },
            orderBy: { createdAt: 'desc' },
            include: { items: true }
        });

        if (!lastOrder || lastOrder.items.length === 0) {
            await sendTextMessage(phone, '📭 No previous orders found.\n\nReply *menu* to start a new order.');
            return;
        }

        const itemLines = lastOrder.items.map((i: any) =>
            `• ${i.name} — ${i.weight >= 1000 ? `${i.weight / 1000}kg` : `${i.weight}g`} ${i.preparationType}`
        ).join('\n');

        const total = lastOrder.total;

        // Store pending reorder items
        const pendingItems = lastOrder.items.map((i: any) => ({
            productId: i.productId,
            productName: i.name,
            emoji: '🥬',
            variantId: i.productVariantId,
            preparationType: i.preparationType,
            weight: i.weight,
            price: i.price,
            quantity: i.quantity
        }));

        await updateSession(phone, { state: 'AWAITING_CART_CONFIRM', pendingItems });

        await sendInteractiveButtons(
            phone,
            `🔁 *Reorder Previous Order?*\n\n${itemLines}\n\n*Total: ₹${total.toFixed(0)}*`,
            [
                { id: 'add_to_cart_confirm', title: '✅ Reorder' },
                { id: 'cancel_order', title: '❌ Cancel' },
            ]
        );
    } catch (e) {
        await sendTextMessage(phone, 'Could not fetch your last order. Please try again.');
    }
}
