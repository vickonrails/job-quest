import { type Session } from '@supabase/auth-helpers-nextjs'
import { type NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { AuthCard, Button, Input } from 'ui'
import { authenticate } from './actions'

import GoogleLogo from '../../../public/google-logo.png'

interface SignInProps {
    session: Session
}

const SignIn: NextPage<SignInProps> = () => {
    return (
        <>
            <Head>
                <title>Sign In</title>
            </Head>
            <AuthCard className="bg-blue-50">
                <div className="p-5 py-6 max-w-sm mx-auto">
                    <div className="mb-8">
                        <h1 className="mb-3 text-3xl font-medium">Welcome to JobQuest!</h1>
                        <p className="text-muted-foreground">Enter you email to get a magic link. Click the link to authenticate.</p>
                    </div>
                    <form action={authenticate}>
                        <Input autoFocus size="lg" placeholder="Enter email" className="mb-2" label="Email" name="email" fullWidth />
                        <Button size="lg" className="mb-3 w-full">Send Magic Link</Button>
                    </form>

                    <Button variant="outline" className="w-full flex gap-1">
                        <span><Image src={GoogleLogo} width={25} height={25} alt="" /></span>
                        <span>Google Login</span>
                    </Button>
                </div>
            </AuthCard>
        </>
    )
}

export default SignIn