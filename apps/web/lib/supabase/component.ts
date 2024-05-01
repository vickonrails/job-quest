import { createBrowserClient } from '@supabase/ssr'
import { type Database } from 'shared'

export function createClient() {
    const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    )

    return supabase
}