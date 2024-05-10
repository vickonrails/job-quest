import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/auth-helpers-react';
import { type AuthChangeEvent } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useUser() {
    const [user, setUser] = useState<User | null>(null)
    const client = createClient();

    useEffect(() => {
        const { data } = client.auth.onAuthStateChange((ev, session) => {
            const relatedEvent: AuthChangeEvent[] = ['SIGNED_IN', 'INITIAL_SESSION']
            if (relatedEvent.includes(ev) && session?.user) {
                setUser(session?.user)
            } else {
                setUser(null)
            }
        })

        return () => data.subscription.unsubscribe()
    }, [client.auth])

    return { user }
}