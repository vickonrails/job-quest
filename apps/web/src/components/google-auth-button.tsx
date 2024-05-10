'use client'

import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { Button } from 'ui/button'
import GoogleLogo from '../../public/google-logo.png'

export default function GoogleAuthBtn() {
    const client = createClient();
    const handleGoogleAuth = async () => {
        const { origin } = window.location
        const redirectTo = `${origin}/auth/callback`
        await client.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo }
        })
    }
    return (
        <Button size="lg" onClick={handleGoogleAuth} variant="outline" className="w-full flex gap-1">
            <Image src={GoogleLogo} width={25} height={25} alt="" />
            <span>Google Login</span>
        </Button>
    )
}
