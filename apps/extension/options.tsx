import React, { useState, type FormEvent } from 'react'
import { supabase as client } from "~core/supabase"
import { Button, Input, AuthCard, Banner } from 'ui'

import './styles/global.css'

const Options = () => {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const handleSignIn = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (emailSent) { return; }
        const callback = `${window.location.origin}/tabs/callback.html`;
        // // regex to validate email
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isValid || !email) {
            // set error state
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        //TODO: still need to fix problem with expired token
        client.auth.signInWithOAuth({
            provider: 'github'
        })
            .then(res => {
                setIsLoading(false);
                setEmailSent(true);
                // toast({
                //     title: 'Email Sent',
                //     variant: 'success',
                //     description: 'Check your email for the magic link',
                //     duration: 5000
                // })
            })
            .catch(err => {
                setIsLoading(false);
                // toast({
                //     title: 'An error occurred',
                //     description: 'An error occurred when trying to send the magic link. Please try again later.',
                // })
            });
    }

    return (
        <AuthCard className='page'>
            <div className="mx-auto md:w-2/3">
                <div className="mb-8">
                    <h1 className="text-center mb-3 text-2xl font-medium">Welcome to JobQuest!</h1>
                    <p className='text-sm text-neutral-500'>Enter you email and we’ll send you a magic link. Click the link to authenticate.</p>
                </div>
                {emailSent && (
                    <Banner
                        variant="success"
                        message={`Login link has been sent to email with address ${email}`}
                    />
                )}
                <form onSubmit={handleSignIn}>
                    <Input autoFocus size="lg" placeholder="Enter email" value={email} onChange={(ev) => setEmail(ev.target.value)} className="mb-4" label="Email" name="email" fullWidth />
                    <Button disabled={emailSent || isLoading} loading={isLoading} size="lg" className="mb-4">Send Magic Link</Button>
                </form>
            </div>
        </AuthCard>
    )
}

export default Options