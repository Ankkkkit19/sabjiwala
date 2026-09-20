import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prismaClient';
import bcrypt from 'bcrypt';
import { createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { email, phone, password } = await req.json();

        if (!password || (!email && !phone)) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        const prisma = await getPrisma();
        if (!prisma) {
            return NextResponse.json({ error: 'Database not available' }, { status: 500 });
        }

        const user = await prisma.user.findFirst({
            where: email ? { email } : { phone },
        });

        if (!user || !user.passwordHash) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        await createSession(user.id, user.role);
        return NextResponse.json({
            user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }
        });
    } catch (error) {
        console.error('Login error', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
