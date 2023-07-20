

import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useJobs, useSession, useUser } from '@hooks';
import { Typography } from 'ui';
import { Button, Spinner } from 'ui';
import { type Job } from 'lib/types';
import { Layout } from '@components/layout';
import JobsTable from '@components/table/JobsTable';

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

    return (
        // TODO: see how to make use of suspense right inside the layout component and other places
        <Layout session={session ?? undefined} >
            {profileLoading ? <Spinner /> : (
                <>
                    <div className="flex justify-between mb-4">
                        <Typography variant="display-xs-md" as="h1">{profile?.username} {'\'s Board'}</Typography>
                        <Button size="sm">New Entry</Button>
                    </div>
                    <div className="overflow-auto rounded-xl">
                        {loadingJobs ? <Spinner /> : <JobsTable jobs={jobs} />}
                    </div>
                </>
            )}
        </Layout>
    )
}

const Jobs = ({ jobs }: { jobs: Job[] }) => {
    return (
        <div className="bg-white">{
            jobs.map(job => (
                <p className="m-2" key={job.id}>{job.position} - {job.company_name}</p>
            ))}
        </div>
    )
}


// consider what approach to use for the dashboard either server-side or client-side rendering

export default Tracker