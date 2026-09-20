import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prismaClient';
import bcrypt from 'bcrypt';
import { createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { name, email, phone, password } = await req.json();

        if (!name || !password || (!email && !phone)) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const prisma = await getPrisma();
        if (!prisma) {
            return NextResponse.json({ error: 'Database not available' }, { status: 500 });
        }

        const query = [];
        if (email) query.push({ email });
        if (phone) query.push({ phone });

        const existing = await prisma.user.findFirst({
            where: {
                OR: query
            },
        });

        if (existing) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email: email || null,
                phone: phone || null,
                passwordHash,
                role: 'CUSTOMER'
            },
        });

        await createSession(user.id, user.role);
        return NextResponse.json({
            user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }
        });
    } catch (error) {
        console.error('Register error', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
