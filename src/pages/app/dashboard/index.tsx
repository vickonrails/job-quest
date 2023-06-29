import { Layout } from '@components/layout'
import React, { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import Spinner from '@components/spinner/Spinner';
import { useSession, useUser } from '@hooks';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from 'lib/database.types';
import { Button } from '@components/button';

// I have to solve the problem of expired tokens and already used tokens
// right now it just redirects to the app page but doesn't load the session

const Index = () => {
    const router = useRouter();
    const client = useSupabaseClient<Database>();
    const [session, sessionLoading] = useSession();
    const [_, loadingProfile] = useUser(session);

    const handleLogout = useCallback(() => {
        client.auth.signOut().then(_ => {
            return router.push('/sign-in');
        }).catch(err => {
            console.log(err)
        });
    }, [client.auth, router])

    useEffect(() => {
        if (!session && !sessionLoading) {
            router.push('/sign-in').catch(err => {
                // handle error
                console.log(err);
            });
        }
    }, [session, router, sessionLoading]);

    return (
        <Layout session={session ?? undefined}>
            <Button size='sm' onClick={handleLogout} className='mr-3'>Log out</Button>
            {(sessionLoading || loadingProfile) ? <Spinner /> : (
                <>
                    <p>Hi {session?.user.email}</p>
                </>
            )}
        </Layout>
    )
}

export default Index