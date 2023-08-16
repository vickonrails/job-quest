import { useCallback, useEffect } from 'react';
import { Layout } from '@components/layout';
import { useSession, useUser } from '@hooks';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from 'lib/database.types';
import { useRouter } from 'next/router';
import { FullPageSpinner } from '@components/spinner';
import { SummaryCard } from '@components/dashboard';
import { WelcomeBanner } from '@components/dashboard/welcome-banner';
import { DashboardSidebar } from '@components/dashboard/dashboard-siderbar';

// I have to solve the problem of expired tokens and already used tokens
// right now it just redirects to the app page but doesn't load the session

const Index = () => {
    const router = useRouter();
    const client = useSupabaseClient<Database>();
    const [session, sessionLoading] = useSession();
    const [, loadingProfile] = useUser(session);

    const handleLogout = useCallback(() => {
        client.auth.signOut().then(_ => {
            return router.push('/sign-in');
        }).catch(err => {
            // console.log(err)
        });
    }, [client.auth, router])

    useEffect(() => {
        if (!session && !sessionLoading) {
            router.push('/sign-in').catch(err => {
                // handle error
                // console.log(err);
            });
        }
    }, [session, router, sessionLoading]);

    return (
        <Layout session={session ?? undefined} className="flex" containerClasses="flex flex-col gap-4">
            {/* <div>
                <Button size="sm" onClick={handleLogout} className="mr-3">Log out</Button>
            </div> */}
            {(sessionLoading || loadingProfile) ? <FullPageSpinner /> : (
                <section className="flex w-full flex-1 gap-4 mt-8">
                    <section className="flex-1">
                        <WelcomeBanner className="mb-4" />
                        <div className="flex w-full gap-4">
                            <SummaryCard title="10" description="Bookmarked applications" />
                            <SummaryCard title="20" description="High priority applications" />
                        </div>
                    </section>
                    <DashboardSidebar className="basis-1/3" />
                </section>
            )}
        </Layout >
    )
}

export default Index
