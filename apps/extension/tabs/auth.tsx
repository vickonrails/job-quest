import GoogleLogo from 'data-base64:~assets/google-logo.png';
import { AuthCard, Button } from 'ui';
import { supabase as client } from '~core/supabase';

import '../styles/global.css';

export default function Auth() {
    const handleGoogleAuth = async () => {
        const redirectTo = `chrome-extension://${chrome.runtime.id}/tabs/callback.html`
        await client.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo }
        })
    }

    return (
        <div className="page">
            <AuthCard className="bg-blue-50">
                <div className="p-5 py-6 max-w-sm mx-auto">
                    <div className="mb-8">
                        <h1 className="mb-3 text-3xl font-medium">Welcome to JobQuest!</h1>
                        <p className="text-base text-muted-foreground">Click on your preferred method of authentication.</p>
                    </div>

                    <Button size="lg" onClick={handleGoogleAuth} variant="outline" className="w-full flex gap-1">
                        <span>
                            <img src={GoogleLogo} width={25} height={25} alt="" />
                        </span>
                        <span>Google Login</span>
                    </Button>
                </div>
            </AuthCard>
        </div>
    )
}
