import React, { useEffect, useState } from 'react'
import { JobForm } from '../../jobs/new'
import { Layout } from '@components/layout'
import { useSession } from '@hooks';
import { ChevronLeft } from 'react-feather';
import { type Job, type JobUpdateDTO } from 'lib/types';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from 'lib/database.types';
import { FullPageSpinner } from '@components/spinner';

const Edit = () => {
    const router = useRouter();
    const client = useSupabaseClient<Database>();
    const [session] = useSession();
    const [jobDetails, setJobDetails] = useState<Job>()
    const [loading, setLoading] = useState(true)
    const jobId = router.query.job as string;

    useEffect(() => {
        if (!jobId) return;
        setLoading(true)
        const fetchJob = async (id: string) => {
            return await client.from('jobs').select().eq('id', id);
        }

        fetchJob(jobId).then(res => {
            setLoading(false)
            const data = res.data
            // @ts-ignore
            setJobDetails(data[0]);
        }).catch(err => {
            setLoading(false)
            // 
        });
    }, [jobId, client])

    const handleSubmit = async (job: JobUpdateDTO) => {
        const { error } = await client.from('jobs').update(job).eq('id', jobId)
        if (error) {
            throw new Error(error.message, { cause: error.details })
        }
    }

    return (
        <Layout session={session ?? undefined}>
            <button className="flex text-light-text mb-4 items-center" onClick={() => router.back()}>
                <ChevronLeft size={20} />
                Back
            </button>
            {loading ?
                <FullPageSpinner /> :
                <JobForm
                    onSubmit={handleSubmit}
                    job={jobDetails}
                />}
        </Layout>
    )
}

export default Edit