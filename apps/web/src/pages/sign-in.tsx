import { Banner } from '@components/banner'
import { useToast } from '@components/toast/use-toast'
import { Typography } from '@components/typography'
import { createPagesServerClient, type Session } from '@supabase/auth-helpers-nextjs'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { type Database } from 'lib/database.types'
import { type GetServerSideProps, type NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { AuthCard, Button, Input } from 'ui'
import GoogleLogo from '../../public/google-logo.png'


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
            email,
            options: {
                shouldCreateUser: true,
                emailRedirectTo: 'http://localhost:3000/api/auth/callback'
            }
        })
            .then(() => {
                setIsLoading(false);
                setEmailSent(true);
                toast({
                    title: 'Email Sent',
                    variant: 'success',
                    description: 'Check your email for the magic link',
                    duration: 5000
                })
            })
            .catch(() => {
                setIsLoading(false);
                toast({
                    title: 'An error occurred',
                    description: 'An error occurred when trying to send the magic link. Please try again later.',
                })
            });
    }

    const handleGoogleAuth = async () => {
        await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: 'http://localhost:3000/api/auth/callback' }
        })
    }

    // TODO: add tests for this rendering
    return (
        <>
            <Head>
                <title>Sign In</title>
            </Head>
            <AuthCard>
                <div className="p-5 py-6 max-w-sm mx-auto">
                    <div className="mb-8">
                        <h1 className="mb-3 text-3xl font-medium">Welcome to JobQuest!</h1>
                        <Typography variant="body-md" className="text-muted-foreground">Enter you email and we’ll send you a magic link. Click the link to authenticate.</Typography>
                    </div>
                    {emailSent && (
                        <Banner
                            variant="success"
                            message={`Login link has been sent to email with address ${email}`}
                        />
                    )}
                    <form onSubmit={handleSignIn}>
                        <Input autoFocus size="lg" placeholder="Enter email" value={email} onChange={(ev: ChangeEvent<HTMLInputElement>) => setEmail(ev.target.value)} className="mb-2" label="Email" name="email" fullWidth />
                        <Button disabled={emailSent || isLoading} size="lg" loading={isLoading} className="mb-3 w-full">Send Magic Link</Button>
                    </form>

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
    const supabase = createPagesServerClient<Database>(context);
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