import { SignOutButton } from '@/components/sign-out'
import { createClient } from '@/utils/supabase/server'
import { cn } from 'shared'

export default async function AppRoot() {
    const client = createClient()
    const { data } = await client.auth.getUser()

    return (
        <div className={cn('flex h-full max-w-screen-2xl m-auto')}>
            Landing page {data.user?.email}
            <SignOutButton />
        </div>
    )
}

