/**
 * WhatsApp Notification System
 * All automated customer and admin notifications live here.
 */

import { sendTextMessage, sendInteractiveButtons } from './sendMessage';

// ─── Customer Notifications ────────────────────────────────────────────────────

export async function notifyCustomerOrderConfirmed(phone: string, orderId: string, total: number) {
    const shortId = orderId.slice(-6).toUpperCase();
    await sendTextMessage(phone,
        `✅ *Order Confirmed!*\n\nYour order *#SW${shortId}* has been confirmed.\nTotal: ₹${total.toFixed(0)}\n\nYour fresh ingredients are being prepared. 🥕\n\nReply *track* anytime to get live updates.`
    );
}

export async function notifyCustomerPreparing(phone: string, orderId: string) {
    const shortId = orderId.slice(-6).toUpperCase();
    await sendTextMessage(phone,
        `🔪 *Your ingredients are being prepared!*\n\nOrder *#SW${shortId}*\n\nOur chef is washing, peeling and cutting your vegetables right now. Won't be long! 😊`
    );
}

export async function notifyCustomerPacked(phone: string, orderId: string) {
    const shortId = orderId.slice(-6).toUpperCase();
    await sendTextMessage(phone,
        `📦 *Order Packed!*\n\nOrder *#SW${shortId}* is hygienically sealed and ready.\n\nOut for delivery soon! 🛵`
    );
}

export async function notifyCustomerOutForDelivery(phone: string, orderId: string) {
    const shortId = orderId.slice(-6).toUpperCase();
    await sendTextMessage(phone,
        `🛵 *On the way!*\n\nYour order *#SW${shortId}* is out for delivery.\n\nExpected in 15–25 minutes. Please be available. 🏠`
    );
}

export async function notifyCustomerDelivered(phone: string, orderId: string) {
    const shortId = orderId.slice(-6).toUpperCase();
    await sendTextMessage(phone,
        `🎉 *Delivered!*\n\nYour order *#SW${shortId}* has been delivered.\n\nEnjoy your fresh ingredients! 🥕🍅🧅\n\nReply *order karo* to reorder anytime.`
    );
}

export async function notifyCustomerPaymentSuccess(phone: string, orderId: string, amount: number, method: string) {
    const shortId = orderId.slice(-6).toUpperCase();
    await sendTextMessage(phone,
        `💳 *Payment Successful!*\n\nOrder *#SW${shortId}*\nAmount: ₹${amount.toFixed(0)}\nMethod: ${method}\n\nStatus: ✅ Paid`
    );
}

// ─── Admin Notifications ───────────────────────────────────────────────────────

export async function notifyAdminNewOrder(
    adminPhone: string,
    order: {
        id: string;
        customerName: string;
        items: { name: string; weight: number; preparationType: string; quantity: number; price: number }[];
        subtotal: number;
        deliveryFee: number;
        total: number;
        paymentMethod: string;
        deliverySlot?: string;
        address: string;
    }
) {
    const shortId = order.id.slice(-6).toUpperCase();
    const itemLines = order.items.map(i =>
        `• ${i.name} — ${i.weight >= 1000 ? `${i.weight / 1000}kg` : `${i.weight}g`} ${i.preparationType.toLowerCase()} × ${i.quantity}`
    ).join('\n');

    const msg =
        `🔔 *NEW ORDER — #SW${shortId}*\n\n` +
        `👤 Customer: ${order.customerName}\n` +
        `📍 Address: ${order.address}\n\n` +
        `*Items:*\n${itemLines}\n\n` +
        `Subtotal: ₹${order.subtotal.toFixed(0)}\n` +
        `Delivery: ₹${order.deliveryFee.toFixed(0)}\n` +
        `*Total: ₹${order.total.toFixed(0)}*\n\n` +
        `💳 Payment: ${order.paymentMethod}\n` +
        (order.deliverySlot ? `🕐 Slot: ${order.deliverySlot}\n` : '') +
        `\nReply with commands to update:\n` +
        `\`confirm SW${shortId}\`\n\`preparing SW${shortId}\`\n\`delivered SW${shortId}\`\n\`cancel SW${shortId}\``;

    await sendTextMessage(adminPhone, msg);
}

export async function notifyAdminLowStock(
    adminPhone: string,
    productName: string,
    currentStockKg: number,
    thresholdKg: number
) {
    await sendTextMessage(adminPhone,
        `⚠️ *LOW STOCK ALERT*\n\n🥬 *${productName}*\n\nAvailable: ${currentStockKg}kg\nMinimum threshold: ${thresholdKg}kg\n\nPlease restock immediately.`
    );
}

export async function notifyAdminOrderCancelled(adminPhone: string, orderId: string, reason?: string) {
    const shortId = orderId.slice(-6).toUpperCase();
    await sendTextMessage(adminPhone,
        `❌ *Order Cancelled — #SW${shortId}*\n${reason ? `\nReason: ${reason}` : ''}`
    );
}

// ─── Daily Report ──────────────────────────────────────────────────────────────

export async function sendDailyReport(
    adminPhone: string,
    report: {
        totalOrders: number;
        revenue: number;
        avgOrderValue: number;
        pending: number;
        preparing: number;
        outForDelivery: number;
        delivered: number;
        cancelled: number;
        topProduct: string;
        topRecipe: string;
    }
) {
    const msg =
        `📊 *SABJIWALA DAILY REPORT*\n\n` +
        `📦 Orders: ${report.totalOrders}\n` +
        `💰 Revenue: ₹${report.revenue.toFixed(0)}\n` +
        `📈 Avg Order Value: ₹${report.avgOrderValue.toFixed(0)}\n\n` +
        `🟡 Pending: ${report.pending}\n` +
        `🔪 Preparing: ${report.preparing}\n` +
        `🛵 Out for Delivery: ${report.outForDelivery}\n` +
        `✅ Delivered: ${report.delivered}\n` +
        `❌ Cancelled: ${report.cancelled}\n\n` +
        `🏆 Top Product: ${report.topProduct}\n` +
        `🍛 Top Recipe: ${report.topRecipe}`;

    await sendTextMessage(adminPhone, msg);
}
