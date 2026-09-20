/**
 * Intent Parser — Hinglish + English NLP (regex-based)
 * Converts raw WhatsApp messages into structured intents.
 */

export type IntentType =
    | 'MENU'
    | 'ORDER_PRODUCT'
    | 'RECIPE_REQUEST'
    | 'VIEW_CART'
    | 'CLEAR_CART'
    | 'CHECKOUT'
    | 'TRACK_ORDER'
    | 'REORDER'
    | 'SUPPORT'
    | 'CANCEL_ORDER'
    | 'ACCOUNT_LINK'
    | 'ADMIN_CMD'          // confirm / preparing / packed / out / delivered / cancel
    | 'ADMIN_PRICE'        // "potato price 45"
    | 'ADMIN_STOCK'        // "onion stock 30kg"
    | 'ADMIN_TOGGLE'       // "disable cauliflower" / "enable tomato"
    | 'ADMIN_REPORT'       // "today report"
    | 'CONFIRM_ACTION'     // "YES" / "CONFIRM" in pending flows
    | 'CANCEL_ACTION'      // "NO" / "CANCEL" in pending flows
    | 'UNKNOWN';

export interface ParsedIntent {
    type: IntentType;
    raw: string;
    data: Record<string, unknown>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const HINGLISH_UNITS: Record<string, number> = {
    'kg': 1000, 'kilo': 1000, 'kilogram': 1000, 'kile': 1000,
    'g': 1, 'gram': 1, 'gm': 1, 'grm': 1,
    '250g': 250, '500g': 500
};

const PRODUCT_ALIASES: Record<string, string> = {
    'aloo': 'potato', 'aalu': 'potato', 'alu': 'potato',
    'pyaz': 'onion', 'pyaaz': 'onion',
    'tamatar': 'tomato', 'tamater': 'tomato',
    'gajar': 'carrot',
    'gobi': 'cauliflower', 'phool gobi': 'cauliflower',
    'shimla mirch': 'capsicum',
    'palak': 'spinach',
    'adrak': 'ginger',
    'lahsun': 'garlic',
    'matar': 'peas', 'mutter': 'peas',
    'baingan': 'brinjal',
    'tori': 'zucchini',
    'kaddu': 'pumpkin',
    'lauki': 'bottlegourd',
    'karela': 'bittergourd',
    'bhindi': 'ladyfinger', 'okra': 'ladyfinger',
    'sem': 'beans', 'fansi': 'beans',
    'chawal': 'rice',
    'aam': 'mango',
    'kela': 'banana',
    'seb': 'apple',
};

const PREP_ALIASES: Record<string, string> = {
    'diced': 'DICED', 'dice': 'DICED', 'kata hua': 'DICED', 'kuta': 'DICED',
    'sliced': 'SLICED', 'slice': 'SLICED',
    'chopped': 'CHOPPED', 'chop': 'CHOPPED',
    'grated': 'GRATED', 'grate': 'GRATED', 'kisa hua': 'GRATED',
    'whole': 'WHOLE', 'sabut': 'WHOLE', 'saboot': 'WHOLE',
    'peeled': 'PEELED', 'chhila hua': 'PEELED',
    'cubed': 'CUBED', 'cube': 'CUBED',
    'halved': 'HALVED', 'adha': 'HALVED',
    'french fry': 'FRENCH_FRY_CUT', 'french fries': 'FRENCH_FRY_CUT',
};

function resolveHinglish(word: string): string {
    return PRODUCT_ALIASES[word.toLowerCase()] ?? word;
}

function resolvePrep(text: string): string | null {
    for (const [alias, prep] of Object.entries(PREP_ALIASES)) {
        if (text.toLowerCase().includes(alias)) return prep;
    }
    return null;
}

function parseWeight(text: string): number | null {
    // e.g. "2 kilo", "500g", "500 gram", "1kg"
    const match = text.match(/(\d+(?:\.\d+)?)\s*(kg|kilo|kilogram|kile|g|gram|gm|grm)/i);
    if (!match) return null;
    const num = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    const multiplier = HINGLISH_UNITS[unit] ?? 1;
    return Math.round(num * multiplier);
}

function parseServings(text: string): number | null {
    // "4 logon ke liye", "for 5 people", "4 people", "5 log"
    const match = text.match(/(\d+)\s*(?:log|logon|person|people|serving|servings|ke liye|for)/i)
        ?? text.match(/(?:for|ke liye)\s*(\d+)/i);
    return match ? parseInt(match[1]) : null;
}

function parseOrderNumber(text: string): string | null {
    const match = text.match(/(?:SW|#)?\s*(\d{4,})/i);
    return match ? `SW${match[1]}` : null;
}

// ─── Main Intent Parser ───────────────────────────────────────────────────────

export function parseIntent(message: string): ParsedIntent {
    const raw = message.trim();
    const msg = raw.toLowerCase();

    // ── Confirmation responses ──
    if (/^(yes|confirm|ha|haan|han|ok|haan ji|ji haan|approve|✅)$/i.test(msg)) {
        return { type: 'CONFIRM_ACTION', raw, data: {} };
    }
    if (/^(no|cancel|nahi|nahi ji|nope|❌|band karo|mat karo)$/i.test(msg)) {
        return { type: 'CANCEL_ACTION', raw, data: {} };
    }

    // ── Menu / Hi ──
    if (/^(hi|hello|hey|menu|start|namaste|hii|namskar|jai shri ram|help karo|kya hai|\/start)$/i.test(msg)) {
        return { type: 'MENU', raw, data: {} };
    }

    // ── Track Order ──
    if (/track|order kaha|kahan hai|status|mera order|my order/i.test(msg)) {
        const orderNo = parseOrderNumber(raw);
        return { type: 'TRACK_ORDER', raw, data: { orderNo } };
    }

    // ── Reorder ──
    if (/same order|dobara|phir se|reorder|wahi order|last order/i.test(msg)) {
        return { type: 'REORDER', raw, data: {} };
    }

    // ── View / clear cart ──
    if (/cart dikha|mera cart|my cart|cart kya hai|show cart/i.test(msg)) {
        return { type: 'VIEW_CART', raw, data: {} };
    }
    if (/cart clear|cart khali|remove all|sab hatao/i.test(msg)) {
        return { type: 'CLEAR_CART', raw, data: {} };
    }

    // ── Checkout ──
    if (/order karo|place order|checkout|book karo|order confirm|finalize/i.test(msg)) {
        return { type: 'CHECKOUT', raw, data: {} };
    }

    // ── Cancel Order ──
    if (/cancel.*order|order.*cancel/i.test(msg)) {
        const orderNo = parseOrderNumber(raw);
        return { type: 'CANCEL_ORDER', raw, data: { orderNo } };
    }

    // ── Support ──
    if (/help|support|problem|issue|complaint|refund|return|not delivered|dikkat/i.test(msg)) {
        return { type: 'SUPPORT', raw, data: {} };
    }

    // ── Account Linking ──
    if (/link.*account|connect.*account|my account|log in|login|register/i.test(msg)) {
        return { type: 'ACCOUNT_LINK', raw, data: {} };
    }

    // ── Admin: Daily report ──
    if (/today report|aaj ki report|daily report|report aaj/i.test(msg)) {
        return { type: 'ADMIN_REPORT', raw, data: {} };
    }

    // ── Admin: Order status command ──
    // e.g. "confirm SW1024", "delivered SW1024", "preparing 1052"
    const adminCmdMatch = msg.match(/^(confirm|preparing|packed|out|delivered|cancel)\s+(sw)?(\d{4,})/i);
    if (adminCmdMatch) {
        const statusMap: Record<string, string> = {
            confirm: 'CONFIRMED',
            preparing: 'PREPARING',
            packed: 'PACKED',
            out: 'OUT_FOR_DELIVERY',
            delivered: 'DELIVERED',
            cancel: 'CANCELLED'
        };
        return {
            type: 'ADMIN_CMD',
            raw,
            data: {
                status: statusMap[adminCmdMatch[1].toLowerCase()],
                orderNo: `SW${adminCmdMatch[3]}`
            }
        };
    }

    // ── Admin: Price change ──
    // e.g. "potato price 45", "aloo ka rate 60 kar do"
    const priceMatch = msg.match(/(\w+)\s+(?:ka\s+)?(?:rate|price|daam|bhav)\s+(\d+)/i)
        ?? msg.match(/(?:rate|price|daam)\s+(\w+)\s+(\d+)/i);
    if (priceMatch) {
        const productRaw = resolveHinglish(priceMatch[1]);
        const price = parseFloat(priceMatch[2]);
        if (price > 0) {
            return { type: 'ADMIN_PRICE', raw, data: { product: productRaw, price } };
        }
    }

    // ── Admin: Stock update ──
    // e.g. "onion stock 30kg", "aloo ka stock 50 kilo"
    const stockMatch = msg.match(/(\w+)\s+(?:ka\s+)?stock\s+(.+)/i)
        ?? msg.match(/stock\s+(\w+)\s+(.+)/i);
    if (stockMatch) {
        const productRaw = resolveHinglish(stockMatch[1]);
        const weight = parseWeight(stockMatch[2]);
        if (weight) {
            return { type: 'ADMIN_STOCK', raw, data: { product: productRaw, stockGrams: weight } };
        }
    }

    // ── Admin: Enable/Disable product ──
    const toggleMatch = msg.match(/(enable|disable|band karo|chalu karo)\s+(\w+)/i);
    if (toggleMatch) {
        const productRaw = resolveHinglish(toggleMatch[2]);
        return {
            type: 'ADMIN_TOGGLE',
            raw,
            data: { product: productRaw, enabled: /enable|chalu/.test(toggleMatch[1]) }
        };
    }

    // ── Recipe Request ──
    // "mujhe 4 logon ke liye aloo gobi banana hai"
    const recipeKeywords = ['banana hai', 'banani hai', 'cook karna', 'recipe', 'kit', 'bana do', 'ingredients chahiye'];
    if (recipeKeywords.some(k => msg.includes(k))) {
        const servings = parseServings(msg);
        // Extract dish name (remove serving phrases)
        const dishRaw = msg
            .replace(/mujhe|maine|hame|please|muje|mujhe/g, '')
            .replace(/\d+\s*(?:log|logon|person|people|ke liye|for)/g, '')
            .replace(/banana hai|banani hai|cook karna|recipe|kit|bana do|ingredients chahiye/g, '')
            .trim();
        return { type: 'RECIPE_REQUEST', raw, data: { dish: dishRaw, servings: servings ?? 2 } };
    }

    // ── Product Order ──
    // "2 kilo aloo", "500 gram chopped onion", "1kg tomato aur 500g onion"
    // Split on "aur" or "and" for multi-item
    const parts = raw.split(/\s+(?:aur|and|,)\s+/i);
    const orderItems: unknown[] = [];

    for (const part of parts) {
        const weight = parseWeight(part);
        if (!weight) continue;

        const prep = resolvePrep(part);

        // Extract product name: remove quantity/unit tokens
        const productRaw = part
            .replace(/\d+(?:\.\d+)?\s*(?:kg|kilo|kilogram|kile|gram|gm|grm|g)\b/gi, '')
            .replace(/diced|sliced|chopped|grated|whole|peeled|cubed/gi, '')
            .trim();

        const productName = resolveHinglish(productRaw.split(/\s+/)[0] ?? productRaw);

        orderItems.push({ productName, weightGrams: weight, prep });
    }

    if (orderItems.length > 0) {
        return { type: 'ORDER_PRODUCT', raw, data: { items: orderItems } };
    }

    // ── Fallback: if message has a quantity+product combo not caught above ──
    // e.g. "500g aloo"
    const simpleOrder = msg.match(/(\d+(?:\.\d+)?)\s*(kg|kilo|g|gram|gm)\s+(\w+)/i);
    if (simpleOrder) {
        const w = parseWeight(`${simpleOrder[1]}${simpleOrder[2]}`);
        const pName = resolveHinglish(simpleOrder[3]);
        if (w && pName) {
            return {
                type: 'ORDER_PRODUCT',
                raw,
                data: { items: [{ productName: pName, weightGrams: w, prep: null }] }
            };
        }
    }

    return { type: 'UNKNOWN', raw, data: {} };
}
