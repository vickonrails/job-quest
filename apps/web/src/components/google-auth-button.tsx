'use client'

import { createClient } from '@/utils/supabase/client'
import { Button } from '@job.quest/ui/button'
import Image from 'next/image'
import GoogleLogo from '../../public/google-logo.png'

export default function GoogleAuthBtn() {
    const client = createClient();
    const handleGoogleAuth = async () => {
        await client.auth.signInWithOAuth({
            provider: 'google',
            // options: { redirectTo: redirectUrlRef.current }
        })
    }

    return (
        <Button size="lg" onClick={handleGoogleAuth} variant="outline" className="w-full flex gap-1">
            <Image src={GoogleLogo} width={25} height={25} alt="" />
            <span>Google Login</span>
        </Button>
    )
}
