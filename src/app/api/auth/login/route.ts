import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { email, phone, name } = await req.json();

        // 🚨 Database check has been fully removed for now as requested.
        // This creates a fake mock user so the frontend works immediately.

        const mockUser = {
            id: 'mock-user-123',
            name: name || 'Demo User',
            email: email || 'demo@example.com',
            phone: phone || '0000000000',
            role: 'CUSTOMER'
        };

        // Create the HTTP-only cookie session
        await createSession(mockUser.id, mockUser.role);

        return NextResponse.json({
            user: mockUser
        });
    } catch (error) {
        console.error('Login error', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
