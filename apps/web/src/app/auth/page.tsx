import GoogleAuthBtn from '@/components/google-auth-button'
import { AuthCard } from 'ui/auth-card'

export default function SignIn() {
    return (
        <AuthCard className="bg-blue-50">
            <div className="p-5 py-6 max-w-sm mx-auto">
                <div className="mb-8">
                    <h1 className="mb-3 text-3xl font-medium">Welcome to JobQuest!</h1>
                    <p className="text-base text-muted-foreground">Click on your preferred method of authentication.</p>
                </div>
                <GoogleAuthBtn />
            </div>
        </AuthCard>
    )
}
