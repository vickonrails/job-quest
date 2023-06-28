import { Layout } from '@components/layout'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Spinner from '@components/spinner/Spinner';
import { useSession, useUser } from '@hooks';

// I have to solve the problem of expired tokens and already used tokens
// right now it just redirects to the app page but doesn't load the session

const Index = () => {
    const router = useRouter();
    const [session, sessionLoading] = useSession();
    const [_, loadingProfile] = useUser(session);

    useEffect(() => {
        console.log(session, sessionLoading);
        if (!session && !sessionLoading) {
            router.push('/sign-in').catch(err => {
                // handle error
                console.log(err);
            });
        }
    }, [session, router, sessionLoading]);

    return (
        <Layout session={session}>
            {(sessionLoading || loadingProfile) ? <Spinner /> : (
                <>
                    <p>Hi {session?.user.email}</p>
                </>
            )}
        </Layout>
    )
}

export default Index