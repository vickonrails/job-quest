import { useState, type FormEvent } from 'react';
import { AuthCard, Button, Input } from 'ui';
import { supabase as client } from '~core/supabase';
import '../styles/global.css';

export default function Auth() {
    const [email, setEmail] = useState('')
    const [emailSent, setEmailSent] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        // if (emailSent) { return; }
        setIsLoading(true);
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isValid || !email) {
            // set error state
            setIsLoading(false);
            return;
        }

        try {
            const redirectUrl = `chrome-extension://${chrome.runtime.id}/tabs/callback.html`
            //TODO: still need to fix problem with expired token
            const { error } = await client.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: true,
                    emailRedirectTo: redirectUrl
                }
            })

            if (error) throw error;
            setEmailSent(true);
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="page">
            <AuthCard className="bg-blue-50">
                <div className="p-5 py-6 max-w-sm mx-auto">
                    <div className="mb-8">
                        <h1 className="mb-3 text-3xl font-medium">Welcome to JobQuest!</h1>
                        <p className="text-base text-muted-foreground">Enter you email to get a magic link. Click the link to authenticate.</p>
                    </div>
                    <form onSubmit={handleSignIn}>
                        <Input
                            autoFocus
                            size="lg"
                            placeholder="Enter email"
                            className="mb-2"
                            label="Email"
                            name="email"
                            fullWidth
                            value={email}
                            onChange={ev => setEmail(ev.target.value)}
                        />
                        <Button size="lg" className="mb-3 w-full">Send Magic Link</Button>
                    </form>

                    {/* <Button size="lg" onClick={handleGoogleAuth} variant="outline" className="w-full flex gap-1">
                        <span><Image src={GoogleLogo} width={25} height={25} alt="" /></span>
                        <span>Google Login</span>
                    </Button> */}
                </div>
            </AuthCard>
        </div>
    )
}
