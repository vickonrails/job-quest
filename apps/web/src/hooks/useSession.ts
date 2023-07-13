import { type Session, useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from 'lib/database.types';
import { useEffect, useState } from 'react';

export const useSession = (): [Session | null, boolean] => {
    const client = useSupabaseClient<Database>();
    const [session, setSession] = useState<Session | null>(null);
    const [sessionLoading, setSessionLoading] = useState(true)

    // there might be a way to cache this so this request is not called every time this hook is used.
    useEffect(() => {
        client.auth.getSession().then(res => {
            if (res.error) {
                throw new Error(res.error.message);
            }
            setSession(res.data.session);
            setSessionLoading(false);
        }).catch(err => {
            setSessionLoading(false);
            setSession(null);
        });

    }, [client.auth]);

    return [session, sessionLoading];
}