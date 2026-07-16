import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isTokenExpired, decodeJwt } from '@/lib/jwt';

// Routes publiques (accessibles sans authentification)
const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/auth/callback'];

// Routes d'authentification (redirect si déjà connecté)
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Récupérer le token depuis les cookies
    const token = request.cookies.get('accessToken')?.value;

    // Vérifier si la route est publique
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

    // Vérifier si c'est une route d'authentification
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // Vérifier la validité du token
    let isValidToken = false;
    let decoded: ReturnType<typeof decodeJwt> = null;
    if (token) {
        // Vérifier que le token n'est pas expiré
        if (!isTokenExpired(token)) {
            // Vérifier que le payload contient les informations nécessaires
            decoded = decodeJwt(token);
            if (decoded && decoded.sub && decoded.email) {
                isValidToken = true;
            }
        }
    }

    // Si le token est invalide/expiré, nettoyer le cookie
    if (token && !isValidToken) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('accessToken');
        return response;
    }

    // PLATFORM RESTRICTION: Web platform is restricted to STAFF users only
    // If the user is authenticated but not a STAFF member, silently logout and redirect to login
    if (isValidToken && decoded && decoded.role !== 'STAFF' && !isPublicRoute && pathname !== '/') {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
        return response;
    }

    // Si l'utilisateur est connecté et essaie d'accéder aux pages de login/register
    if (isValidToken && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
    if (!isValidToken && !isPublicRoute && pathname !== '/') {
        const response = NextResponse.redirect(new URL('/login', request.url));
        // Ajouter l'URL de redirection après login
        response.cookies.set('redirectAfterLogin', pathname, {
            path: '/',
            maxAge: 60 * 5, // 5 minutes
        });
        return response;
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
