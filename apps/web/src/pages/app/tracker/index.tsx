

import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useSession, useUser } from '@hooks';
import { Typography, Button } from 'ui';
import { Layout } from '@components/layout';
import JobsTable from '@components/table/job/JobsTable';
import { FullPageSpinner } from '@components/spinner';
import { reportError } from 'src/utils/reportError';

const Tracker = () => {
    const router = useRouter();
    const [session, sessionLoading] = useSession();
    const [profile, profileLoading] = useUser(session);

    useEffect(() => {
        if (!session && !sessionLoading) {
            router.push('/sign-in').catch(err => {
                reportError(err);
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
        <Layout session={session ?? undefined} >
            {profileLoading ? <FullPageSpinner /> : (
                <>
                    <div className="flex justify-between mb-4">
                        <Typography variant="display-xs-md" as="h1">{profile?.username} {'\'s Board'}</Typography>
                        <Button size="sm" onClick={navigateToNew}>New Entry</Button>
                    </div>
                    <div className="overflow-auto rounded-xl">
                        <JobsTable />
                    </div>
                </>
            )}
        </Layout>
    )
}

// TODO: consider what approach to use for the dashboard either server-side or client-side rendering

export default Tracker