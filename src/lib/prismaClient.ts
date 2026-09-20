/**
 * Prisma Client singleton
 * Uses dynamic import to avoid build-time errors when client is not generated yet.
 */

let _prisma: any = null;

async function getPrisma() {
    if (_prisma) return _prisma;
    try {
        const { PrismaClient } = await import('@prisma/client' as any);
        const globalForPrisma = globalThis as any;
        _prisma = globalForPrisma.prisma ?? new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
        });
        if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = _prisma;
        return _prisma;
    } catch (e) {
        console.error('[Prisma] Client not available:', e);
        return null;
    }
}

export default getPrisma;
