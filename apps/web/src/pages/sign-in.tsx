import React, { type FormEvent, useState } from 'react'

import Head from 'next/head'
import { type NextPage, type GetServerSideProps } from 'next'
import { createServerSupabaseClient, type Session } from '@supabase/auth-helpers-nextjs'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { type Database } from 'lib/database.types'
import { AuthCard } from '@components/auth/authCard'
import { Typography } from '@components/typography'
import Banner from '@components/banner/Banner'
import { Button } from '@components/button'
import { Input } from '@components/input'

interface SignInProps {
    session: Session
}

const SignIn: NextPage<SignInProps> = () => {
    const supabaseClient = useSupabaseClient<Database>();
    const [email, setEmail] = useState('')
    const [emailSent, setEmailSent] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // TODO: add tests for this
    const handleSignIn = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (emailSent) { return; }
        setIsLoading(true);
        // // regex to validate email
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isValid || !email) {
            // set error state
            return;
        }

        //TODO: still need to fix problem with expired token
        supabaseClient.auth.signInWithOtp({
            email, options: {
                emailRedirectTo: `${window.location.origin}/app`
            }
        })
            .then(res => {
                console.log(res)
                setIsLoading(false);
                setEmailSent(true);
            })
            .catch(err => {
                setIsLoading(false);
                console.log(err);
            });
    }

    // TODO: add tests for this rendering
    return (
        <>
            <Head>
                <title>Sign In</title>
            </Head>
            <AuthCard>
                <div className='mx-auto md:w-2/3'>
                    <div className='mb-8'>
                        <Typography as='h1' variant='display-xs-md' className='text-center mb-3'>Welcome to JobQuest!</Typography>
                        <Typography variant='body-sm'>Enter you email and we’ll send you a magic link. Click the link to authenticate.</Typography>
                    </div>
                    {emailSent && (
                        <Banner
                            variant='success'
                            message={`Login link has been sent to email with address ${email}`}
                        />
                    )}
                    <form onSubmit={handleSignIn}>
                        <Input autoFocus size='lg' placeholder='Enter email' value={email} onChange={(ev) => setEmail(ev.target.value)} className='mb-4' label='Email' name="email" fullWidth />
                        <Button disabled={emailSent || isLoading} loading={isLoading} size='lg' fullWidth className='mb-4'>Send Magic Link</Button>
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
                destination: '/app/dashboard',
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