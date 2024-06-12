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

    if (!user) {
        if (url.pathname === '/auth') {
            return response
        }

        if (isProtectedRoute) {
            url.pathname = '/auth'
            return NextResponse.redirect(url)
        }
    }

    if (url.pathname === '/auth') {
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    // if (user && isProtectedRoute) {
    //     const { data: profile } = await client.from('profiles').select('*').eq('id', user.id).single();
    //     if (profile && !profile.is_profile_setup) {
    //         url.pathname = '/profile/resume-upload'
    //         return NextResponse.redirect(url)
    //     }
    // }

    // redirect unauthorized users
    // if (isProtectedRoute && !user) {
    //     url.pathname = '/auth'
    //     return NextResponse.redirect(url);
    // }

    // if (!user) {
    //     url.pathname = '/auth'
    //     return NextResponse.redirect(url);
    // }

    // // take user to dashboard if they're logged in
    // if (user && url.pathname === '/auth') {
    //     url.pathname = '/dashboard'
    //     return NextResponse.redirect(url)
    // }

    // // TODO: feature where we redirect to the intended page right before the redirection to the profile setup
    // if (user && (isProtectedRoute || url.pathname === '/auth')) {
    //     const { data } = await client.from('profiles').select('*').eq('id', user.id).single();
    //     if (!data) {
    //         // todo: handle profile not created
    //     }

    //     if (!data?.is_profile_setup) {
    //         url.pathname = '/profile/resume-upload'
    //         return NextResponse.redirect(url)
    //     }
    // }

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