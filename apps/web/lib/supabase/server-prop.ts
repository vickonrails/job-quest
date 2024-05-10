import { createServerClient, type CookieOptions, serialize } from '@supabase/ssr'
import { type GetServerSidePropsContext } from 'next'
import { type Database } from 'shared'

export function createClient(context: GetServerSidePropsContext) {
    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    console.log(context.req.cookies[name])
                    return context.req.cookies[name]
                },
                set(name: string, value: string, options: CookieOptions) {
                    context.res.appendHeader('Set-Cookie', serialize(name, value, options))
                },
                remove(name: string, options: CookieOptions) {
                    context.res.appendHeader('Set-Cookie', serialize(name, '', options))
                },
            },
        }
    )

    return supabase
}