import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'sabjiwala-fallback-super-secret');

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // We only protect /admin routes using Edge middleware.
    // Further Server-Side Component logic will re-verify.
    if (path.startsWith('/admin')) {
        const token = request.cookies.get('session')?.value;
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: ['HS256'] });
            if (payload.role !== 'ADMIN') {
                return NextResponse.redirect(new URL('/login', request.url));
            }
        } catch (error) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
