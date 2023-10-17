import type { User } from "@supabase/supabase-js"
import { supabase as client } from '~core/supabase'

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import { useEffect, useState } from "react"

function IndexOptions() {
    const [auth, setAuth] = useStorage('auth')
    const [user, setUser] = useState()

    useEffect(() => {
        const { data: authListener } = client.auth.onAuthStateChange((evt, session) => {
            if (evt === 'SIGNED_OUT') {
                setAuth(null);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        }
    }, [])

    useEffect(() => {
        if (auth) {
            client.auth.getUser(auth.access_token).then(({ data }) => {
                console.log(data);
            })
        }
    }, [])

    if (!auth) {
        return (
            <div>
                <button>Sign In</button>
                <p>You have to authenticate to use the app</p>
            </div>
        )
    }

    const handleLogOut = () => {
        client.auth.signOut();
    }

    return (
        <main>
            <button onClick={handleLogOut}>Log Out</button>
            Hi there {JSON.stringify(auth)}
        </main>
    )
}

export default IndexOptions
