import { updateSession } from '@/utils/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from './utils/supabase/server';

const protectedRoutes = ['/dashboard', '/job-tracker', '/resumes', 'profile']
const isProd = process.env.NODE_ENV === 'production'

export async function middleware(request: NextRequest) {
    const url = new URL(request.url)
    const { response } = await updateSession(request)
    const client = createClient()
    const { data: { user } } = await client.auth.getUser()
    const isProtectedRoute = protectedRoutes.some(x => x.startsWith(url.pathname))

    // prevent exploration of app for now
    if (isProd && url.pathname !== '/') {
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    // redirect unauthorized users
    if (isProtectedRoute && !user) {
        url.pathname = '/auth'
        return NextResponse.redirect(url);
    }

    // take user to dashboard if they're logged in
    if (user && url.pathname === '/auth') {
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}