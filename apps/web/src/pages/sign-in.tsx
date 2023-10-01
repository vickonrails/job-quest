import React, { type FormEvent, useState } from 'react'

import Head from 'next/head'
import { type NextPage, type GetServerSideProps } from 'next'
import { createServerSupabaseClient, type Session } from '@supabase/auth-helpers-nextjs'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { type Database } from 'lib/database.types'
import { Banner } from '@components/banner'
import { Typography } from '@components/typography'
import { useToast } from '@components/toast/use-toast'
import { Button, Input, AuthCard } from 'ui'

interface SignInProps {
    session: Session
}

// TODO: handle sign in error or expired token
const SignIn: NextPage<SignInProps> = () => {
    const supabaseClient = useSupabaseClient<Database>();
    const [email, setEmail] = useState('')
    const [emailSent, setEmailSent] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()

    // TODO: add tests for this
    const handleSignIn = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (emailSent) { return; }
        setIsLoading(true);
        // // regex to validate email
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isValid || !email) {
            // set error state
            setIsLoading(false);
            return;
        }

        //TODO: still need to fix problem with expired token
        supabaseClient.auth.signInWithOtp({
            email
        })
            .then(res => {
                setIsLoading(false);
                setEmailSent(true);
                toast({
                    title: 'Email Sent',
                    variant: 'success',
                    description: 'Check your email for the magic link',
                    duration: 5000
                })
            })
            .catch(err => {
                setIsLoading(false);
                toast({
                    title: 'An error occurred',
                    description: 'An error occurred when trying to send the magic link. Please try again later.',
                })
            });
    }

    // TODO: add tests for this rendering
    return (
        <>
            <Head>
                <title>Sign In</title>
            </Head>
            <AuthCard>
                <div className="mx-auto md:w-2/3">
                    <div className="mb-8">
                        <Typography as="h1" variant="display-xs-md" className="text-center mb-3">Welcome to JobQuest!</Typography>
                        <Typography variant="body-sm">Enter you email and we’ll send you a magic link. Click the link to authenticate.</Typography>
                    </div>
                    {emailSent && (
                        <Banner
                            variant="success"
                            message={`Login link has been sent to email with address ${email}`}
                        />
                    )}
                    <form onSubmit={handleSignIn}>
                        <Input autoFocus size="lg" placeholder="Enter email" value={email} onChange={(ev) => setEmail(ev.target.value)} className="mb-4" label="Email" name="email" fullWidth />
                        <Button disabled={emailSent || isLoading} loading={isLoading} size="lg" fullWidth className="mb-4">Send Magic Link</Button>
                    </form>
                </div>
            </AuthCard>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createServerSupabaseClient<Database>(context);
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            session
        }
    }
}



export default SignIn