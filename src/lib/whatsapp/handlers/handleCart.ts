import { sendTextMessage, sendInteractiveButtons } from '../sendMessage';
import { formatWeight } from '@/lib/utils';

export async function handleViewCart(phone: string) {
    try {
        const { default: prisma } = await import('@/lib/prismaClient');
        const cart = await (prisma as any).whatsAppCart.findUnique({ where: { phoneNumber: phone } });
        const items: any[] = cart?.items ?? [];

        if (items.length === 0) {
            await sendInteractiveButtons(
                phone,
                `🛒 *Your cart is empty!*\n\nStart ordering fresh vegetables or explore recipe kits.`,
                [
                    { id: 'browse_vegetables', title: '🥕 Shop Vegetables' },
                    { id: 'browse_recipes', title: '🍛 Recipe Kits' },
                ]
            );
            return;
        }

        const total = items.reduce((s: number, i: any) => s + (i.price * (i.quantity ?? 1)), 0);
        const lines = items.map((i: any) =>
            `${i.emoji ?? '🥬'} *${i.productName}*\n   ${formatWeight(i.weight)} × ${i.quantity ?? 1} = ₹${(i.price * (i.quantity ?? 1)).toFixed(0)}`
        ).join('\n\n');

        await sendInteractiveButtons(
            phone,
            `🛒 *Your Cart*\n\n${lines}\n\n*Total: ₹${total.toFixed(0)}*`,
            [
                { id: 'checkout', title: '✅ Checkout' },
                { id: 'clear_cart', title: '🗑️ Clear Cart' },
            ]
        );
    } catch (e) {
        await sendTextMessage(phone, 'Sorry, could not fetch your cart. Please try again.');
    }
}

export async function handleClearCart(phone: string) {
    try {
        const { default: prisma } = await import('@/lib/prismaClient');
        await (prisma as any).whatsAppCart.upsert({
            where: { phoneNumber: phone },
            create: { phoneNumber: phone, items: [] },
            update: { items: [] }
        });
        await sendTextMessage(phone, '🗑️ Your cart has been cleared.\n\nReply *menu* to start fresh.');
    } catch (e) {
        await sendTextMessage(phone, 'Could not clear cart. Please try again.');
    }
}
