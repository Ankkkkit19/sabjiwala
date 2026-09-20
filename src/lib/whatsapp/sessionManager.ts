/**
 * Session Manager
 * Maintains per-phone-number conversation state in the database.
 * Falls back to in-memory if DB not connected (dev mode).
 */

// We use a simple in-memory map as fallback for local dev
// In production this always reads/writes from the DB via Prisma

const inMemorySessions = new Map<string, SessionData>();

export interface SessionData {
    state: string;
    userId?: string;
    pendingItems?: unknown[];
    pendingRecipe?: { dish: string; servings: number };
    pendingAddress?: string;
    pendingOrderNo?: string;
    awaitingConfirmation?: boolean;
    [key: string]: unknown;
}

export async function getSession(phoneNumber: string): Promise<SessionData> {
    try {
        const { default: prisma } = await import('@/lib/prismaClient');
        const session = await (prisma as any).whatsAppSession.findUnique({
            where: { phoneNumber }
        });
        if (!session) return { state: 'MENU' };
        return { state: session.state, userId: session.userId ?? undefined, ...(session.sessionData as object ?? {}) };
    } catch {
        // DB not available — use in-memory
        return inMemorySessions.get(phoneNumber) ?? { state: 'MENU' };
    }
}

export async function updateSession(phoneNumber: string, data: Partial<SessionData>) {
    const current = await getSession(phoneNumber);
    const merged = { ...current, ...data };

    try {
        const { default: prisma } = await import('@/lib/prismaClient');
        const { state, userId, ...rest } = merged;
        await (prisma as any).whatsAppSession.upsert({
            where: { phoneNumber },
            create: { phoneNumber, state, userId: userId ?? null, sessionData: rest },
            update: { state, userId: userId ?? null, sessionData: rest }
        });
    } catch {
        inMemorySessions.set(phoneNumber, merged);
    }
}

export async function clearSession(phoneNumber: string) {
    try {
        const { default: prisma } = await import('@/lib/prismaClient');
        await (prisma as any).whatsAppSession.upsert({
            where: { phoneNumber },
            create: { phoneNumber, state: 'MENU' },
            update: { state: 'MENU', sessionData: null, userId: null }
        });
    } catch {
        inMemorySessions.delete(phoneNumber);
    }
}
