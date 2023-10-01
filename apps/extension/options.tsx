import React, { useState, type FormEvent } from 'react'
import { supabase as client } from "~core/supabase"
import { Button, Input } from 'ui'

import 'ui/dist/styles.css'
import './styles/global.css'

const Options = () => {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const handleSignIn = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (emailSent) { return; }
        setIsLoading(true);
        return;
        // // regex to validate email
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isValid || !email) {
            // set error state
            setIsLoading(false);
            return;
        }

        //TODO: still need to fix problem with expired token
        client.auth.signInWithOtp({
            email, options: {
                emailRedirectTo: `${window.location.origin}`
            }
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
        <div className='page options grid h-full'>
            <form onSubmit={handleSignIn} className='border p-5 max-w-xl mt-32 m-auto w-full flex'>
                <div className='max-w-xs mx-auto'>
                    <h1 className='text-2xl text-center font-medium mb-3'>Sign In to Job Quest</h1>
                    <p className='text-sm text-neutral-500 mb-10'>Enter you email and we’ll send you a magic link. Click the link to authenticate.</p>

                    <Input
                        value={email}
                        className='mb-4'
                        size='lg'
                        type='email'
                        onChange={ev => setEmail(ev.target.value)}
                        label='Email Address'
                        placeholder='Enter your email address'
                    />
                    <Button size='lg' loading={isLoading}>Send Magic Link</Button>
                </div>
            </form>
        </div>
    )
}

export default Options