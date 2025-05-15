// middleware.ts (enhanced version)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const publicPaths = ['/', '/login', '/register', '/terms', '/privacy'];
const authPaths = ['/login', '/register'];
const protectedPaths = ['/dashboard', '/transactions', '/settings', '/report'];

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const isAuth = !!token;
    const { pathname } = request.nextUrl;

    // Check if path is in our defined routes
    const isPublicPath = publicPaths.includes(pathname);
    const isAuthPath = authPaths.includes(pathname);
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

    // Allow public paths
    if (isPublicPath && !isAuthPath) {
        return NextResponse.next();
    }

    // Redirect authenticated users away from auth pages
    if (isAuthPath && isAuth) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Protect dashboard routes
    if (isProtectedPath && !isAuth) {
        const url = new URL('/login', request.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
    }

    // Check subscription status for premium features
    if (isAuth && token) {
        const isPremiumPath = pathname.startsWith('/report') || pathname.startsWith('/advanced');
        if (isPremiumPath && token.subscription !== 'pro') {
            return NextResponse.redirect(new URL('/pricing', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};