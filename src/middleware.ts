import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'sabjiwala-fallback-super-secret');

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Allow static files, Next.js internal paths, and API auth routes
    if (
        path.startsWith('/_next') ||
        path.startsWith('/images/') ||
        path.startsWith('/favicon.ico') ||
        path.startsWith('/api/auth/') ||
        path.startsWith('/api/whatsapp/') ||
        path === '/login'
    ) {
        return NextResponse.next();
    }

    const token = request.cookies.get('session')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: ['HS256'] });

        // If it's an admin path, ensure the role is ADMIN
        if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
            if (payload.role !== 'ADMIN') {
                return NextResponse.redirect(new URL('/', request.url));
            }
        }
    } catch (error) {
        // Token is invalid/expired
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Matcher now matches all paths except /api (but we want to match /api/admin), so just match all paths.
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
