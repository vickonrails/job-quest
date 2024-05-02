import { createClient } from '@lib/supabase/component'
import { createClient as createServerClient } from '@lib/supabase/server-prop'
import { type GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { AuthCard, Button } from 'ui'
import GoogleLogo from '../../public/google-logo.png'

// TODO: handle sign in error or expired token
function SignIn() {
    const client = createClient()
    const redirectUrlRef = useRef<string>('');

    useEffect(() => {
        const { protocol, host } = window.location;
        const redirectUrl = `${protocol}//${host}/api/auth/callback`;
        redirectUrlRef.current = redirectUrl;
    }, [])

    const handleGoogleAuth = async () => {
        await client.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: redirectUrlRef.current }
        })
    }

    // TODO: add tests for this rendering
    return (
        <>
            <Head>
                <title>Sign In</title>
            </Head>
            <AuthCard className="bg-blue-50">
                <div className="p-5 py-6 max-w-sm mx-auto">
                    <div className="mb-8">
                        <h1 className="mb-3 text-3xl font-medium">Welcome to JobQuest!</h1>
                        <p className="text-base text-muted-foreground">Click on your preferred method of authentication.</p>
                    </div>
                    <Button size="lg" onClick={handleGoogleAuth} variant="outline" className="w-full flex gap-1">
                        <span><Image src={GoogleLogo} width={25} height={25} alt="" /></span>
                        <span>Google Login</span>
                    </Button>
                </div>
            </AuthCard>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createServerClient(context);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}

export default SignIn