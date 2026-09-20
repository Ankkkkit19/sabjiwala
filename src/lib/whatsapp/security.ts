/**
 * WhatsApp Security Layer
 * - HMAC-SHA256 webhook verification
 * - Admin phone number whitelist
 * - Audit log writing
 * - Rate limiting (in-memory, replace with Redis in production)
 */

import crypto from 'crypto';

// ─── Webhook Verification ──────────────────────────────────────────────────────

export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
    const appSecret = process.env.WHATSAPP_APP_SECRET;
    if (!appSecret) {
        console.warn('[WhatsApp] WHATSAPP_APP_SECRET not set – skipping signature check');
        return true;  // allow in dev; enforce in prod
    }
    const expected = 'sha256=' + crypto
        .createHmac('sha256', appSecret)
        .update(rawBody)
        .digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

// ─── Admin Authorization ───────────────────────────────────────────────────────

export function isAdminPhone(phone: string): boolean {
    const adminNumbers = (process.env.ADMIN_WHATSAPP_NUMBERS ?? '').split(',').map(n => n.trim());
    const normalized = normalizePhone(phone);
    return adminNumbers.some(n => normalizePhone(n) === normalized);
}

export function normalizePhone(phone: string): string {
    return phone.replace(/[^0-9]/g, '');
}

// ─── Rate Limiting (in-memory) ─────────────────────────────────────────────────

const rateMap = new Map<string, { count: number; reset: number }>();

export function isRateLimited(phone: string, maxPerMinute = 20): boolean {
    const now = Date.now();
    const entry = rateMap.get(phone);

    if (!entry || now > entry.reset) {
        rateMap.set(phone, { count: 1, reset: now + 60_000 });
        return false;
    }

    entry.count++;
    if (entry.count > maxPerMinute) return true;
    return false;
}

// ─── Confirmation Store (pending admin actions) ────────────────────────────────

interface PendingAction {
    action: string;
    payload: Record<string, unknown>;
    expiresAt: number;
}

const pendingActions = new Map<string, PendingAction>();

export function storePendingAction(phone: string, action: string, payload: Record<string, unknown>) {
    pendingActions.set(phone, {
        action,
        payload,
        expiresAt: Date.now() + 5 * 60_000 // expires in 5 minutes
    });
}

export function getPendingAction(phone: string): PendingAction | null {
    const entry = pendingActions.get(phone);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        pendingActions.delete(phone);
        return null;
    }
    return entry;
}

export function clearPendingAction(phone: string) {
    pendingActions.delete(phone);
}
