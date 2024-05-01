import { sendToBackground } from '@plasmohq/messaging';
import { useStorage } from '@plasmohq/storage/hook';
import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { supabase } from '~core/supabase';

/**
 * useAuth hook to return current user session
 */
export function useAuth() {
    const [session, setSession] = useStorage<Session>('session')
    const [firstRender, setFirstRender] = useState(true)

    useEffect(() => {
        supabase.auth.onAuthStateChange((ev, session) => {
            if (!session && ev === 'SIGNED_OUT') {
                setSession(null).then(res => {
                    // 
                }).catch(err => {
                    // 
                })
            }
        })
    }, [setSession])

    // This useEffect is a hack to solve the bug in useStorage that makes the first render value undefined.
    useEffect(() => {
        const timer = setTimeout(() => {
            setFirstRender(false);
        }, 1000)

        return () => {
            clearTimeout(timer)
        }
    }, []);

    useEffect(() => {
        if (firstRender) return;

        if (!session) {
            navigateToAuth()
        }

    }, [firstRender, session])

    return { session, loading: firstRender }
}

/**
 * Navigate to auth function
 */
function navigateToAuth() {
    sendToBackground({
        name: 'auth',
        body: {
            action: 'navigate-to-auth'
        }
    }).then(() => {
        // 
    }).catch(() => {
        // 
    })
}