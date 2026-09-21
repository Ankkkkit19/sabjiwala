import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import getPrisma from '@/lib/prismaClient';
import { redirect } from 'next/navigation';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'sabjiwala-fallback-super-secret');

interface SessionPayload {
    userId: string;
    role: string;
}

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload as any)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET);
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: ['HS256'] });
        return payload as unknown as SessionPayload;
    } catch (error) {
        return null;
    }
}

export async function createSession(userId: string, role: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ userId, role });

    const cookieStore = await cookies();
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}

export async function verifySession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    if (!token) return null;

    const session = await decrypt(token);
    if (!session?.userId) {
        return null;
    }

    return { userId: session.userId, role: session.role };
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}

export async function getCurrentUser() {
    const session = await verifySession();
    if (!session) return null;

    // 🚨 Database check has been fully removed for now as requested.
    // Return a mock user matching the session instead of querying DB.
    return {
        id: session.userId,
        name: 'Demo User',
        email: 'demo@example.com',
        phone: '0000000000',
        role: session.role || 'CUSTOMER'
    };
}

export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/login');
    }
    return user;
}

export async function requireAdmin() {
    const user = await requireAuth();
    if (user.role !== 'ADMIN') {
        redirect('/login');
    }
    return user;
}
