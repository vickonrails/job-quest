import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from '../../lib/database.types';
import { type Job } from '../../lib/types';
import { useEffect, useState } from 'react'

type UseJobsRtrn = {
    loading: boolean,
    jobs: Job[],
    refreshing: boolean,
    refresh: () => Promise<void>
};

// TODO: add request parameters 
// so I can implement search, pagination & limit, etc
// also research possible ways to add react query in here too
export const useJobs = (): UseJobsRtrn => {
    const client = useSupabaseClient<Database>();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const refresh = async () => {
        setRefreshing(true);
        const { data, error } = await client.from('jobs').select();
        setRefreshing(false);

        if (error) {
            throw error;
        }
        setJobs(data || [])
    }

    useEffect(() => {
        const fetchJobs = async () => {
            return await client.from('jobs').select();
        }

        fetchJobs().then(res => {
            if (res.data) {
                setJobs(res.data);
                setLoading(false)
            }
        }).catch(err => {
            setLoading(false);
            setJobs([])
        })
    }, [loading, client]);

    return { loading, jobs, refresh, refreshing };
}