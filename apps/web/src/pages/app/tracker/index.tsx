

import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useJobs, useSession, useUser } from '@hooks';
import { Typography, Button } from 'ui';
import { type Job } from 'lib/types';
import { Layout } from '@components/layout';
import JobsTable from '@components/table/JobsTable';
import { FullPageSpinner } from '@components/spinner';

// header with column type &  title

const Tracker = () => {
    const router = useRouter();
    const [session, sessionLoading] = useSession();
    const [profile, profileLoading] = useUser(session);
    const [loadingJobs, jobs] = useJobs();

    useEffect(() => {
        if (!session && !sessionLoading) {
            router.push('/sign-in').catch(err => {
                // handle error
                // console.log(err);
            });
        }
    }, [session, router, sessionLoading]);

    const navigateToNew = () => {
        router.push('/app/tracker/jobs/new').then(_ => {
            // 
        }).catch(_ => {
            // 
        })
    }

    return (
        // TODO: see how to make use of suspense right inside the layout component and other places
        <Layout session={session ?? undefined} >
            {profileLoading ? <FullPageSpinner /> : (
                <>
                    <div className="flex justify-between mb-4">
                        <Typography variant="display-xs-md" as="h1">{profile?.username} {'\'s Board'}</Typography>
                        <Button size="sm" onClick={navigateToNew}>New Entry</Button>
                    </div>
                    <div className="overflow-auto rounded-xl">
                        {loadingJobs ? <FullPageSpinner /> : <JobsTable jobs={jobs} />}
                    </div>
                </>
            )}
        </Layout>
    )
}


// consider what approach to use for the dashboard either server-side or client-side rendering

export default Tracker