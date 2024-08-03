

import GoogleAuthBtn from '@/components/google-auth-button'
import { type Metadata } from 'next'
import AuthContainer from './components/auth-container'

export const metadata: Metadata = {
    title: 'Create account & Authenticate - JobQuest'
}

export default function SignIn() {
    return (
        <AuthContainer>
            <div className="p-5 py-6 max-w-sm mx-auto">
                <div className="mb-8">
                    <h1 className="mb-3 text-3xl font-medium">Welcome to JobQuest!</h1>
                    <p className="text-base text-muted-foreground">Click on your preferred method of authentication.</p>
                </div>
                <GoogleAuthBtn />
            </div>
        </AuthContainer>
    )
}
