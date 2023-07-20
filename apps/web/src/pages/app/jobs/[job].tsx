import { useSession, useUser } from '@hooks';
import React, { useEffect, useState } from 'react'
import { Layout } from '@components/layout';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from 'lib/database.types';
import { type Job } from 'lib/types';

const JobDetails = () => {
    const router = useRouter();
    const jobId = router.query.job as string;

    const [session, sessionLoading] = useSession();
    const [profile, profileLoading] = useUser(session);
    const client = useSupabaseClient<Database>();
    const [jobDetails, setJobDetails] = useState<Job>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const fetchJob = async (id: string) => {
            return await client.from('jobs').select().eq('id', id);
        }

        fetchJob(jobId).then(res => {
            setLoading(false)
            const data = res.data
            // @ts-ignore
            setJobDetails(data);
        }).catch(err => {
            setLoading(false)
            // 
        });
    }, [jobId, client])

    return (
        <Layout session={session ?? undefined}>
            {loading ?
                <p>Loading...</p> :
                JSON.stringify(jobDetails)}
        </Layout>
    )
}

export default JobDetails