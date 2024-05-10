'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation';
import React from 'react'

export function SignOutButton() {
    const client = createClient();
    const router = useRouter();

    const signout = async () => {
        await client.auth.signOut();
        router.push('/auth')
    }

    return (
        <button onClick={signout}>SignOut</button>
    )
}
