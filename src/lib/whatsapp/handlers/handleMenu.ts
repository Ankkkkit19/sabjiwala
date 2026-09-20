import { sendTextMessage, sendInteractiveButtons, sendListMessage } from '../sendMessage';

export async function handleMenu(phone: string) {
    await sendInteractiveButtons(
        phone,
        `Welcome to *SabjiWala* 🥕\n\n_Fresh vegetables, fruits and cooking-ready ingredients delivered to your doorstep._\n\nHow can we help you today?`,
        [
            { id: 'order_now', title: '🛒 Order Now' },
            { id: 'what_to_cook', title: '👨‍🍳 What to Cook?' },
            { id: 'track_order', title: '📦 Track Order' },
        ],
        'SabjiWala 🥕'
    );

    // Then send follow-up as a list for the rest
    await new Promise(r => setTimeout(r, 500));
    await sendListMessage(
        phone,
        'Choose a category to browse:',
        'Browse',
        [
            {
                title: 'Shop',
                rows: [
                    { id: 'browse_vegetables', title: '🥕 Vegetables', description: 'Pre-cut, fresh, farm sourced' },
                    { id: 'browse_fruits', title: '🍎 Fruits', description: 'Daily fresh fruits' },
                    { id: 'browse_recipes', title: '🍛 Recipe Kits', description: 'All-in-one cooking kits' },
                ]
            },
            {
                title: 'Account',
                rows: [
                    { id: 'view_cart', title: '🛒 View My Cart' },
                    { id: 'reorder', title: '🔁 Reorder Previous' },
                    { id: 'support', title: '💬 Support' },
                ]
            }
        ]
    );
}
