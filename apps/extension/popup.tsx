import { supabase as client } from '~core/supabase'

import { useStorage } from "@plasmohq/storage/hook"
import { useEffect } from "react"
import { sendToBackground } from "@plasmohq/messaging"

function IndexOptions() {
    const [auth, setAuth] = useStorage('auth')

    useEffect(() => {
        const { data: listener } = client.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setAuth(null);
            }
        })

        return () => {
            listener.subscription.unsubscribe();
        }
    }, [])

    const handleLogin = async () => {
        const result = await sendToBackground({
            name: 'handle-auth'
        })

        setAuth(result)
    }

    const handleLogout = async () => {
        client.auth.signOut();
    }

    return (
        <main style={{ width: 300 }}>
            {auth ? (
                <div>
                    <p>Welcome {auth.data.session.user.user_metadata.full_name}</p>
                    <button onClick={handleLogout}>Log out</button>
                </div>
            ) : (
                <button onClick={handleLogin}>Sign In</button>
            )}
        </main>
    )
}

export default IndexOptions
