
import { getJobs, type JobFetchOptions } from '@/db/queries/jobs.query';
import { createClient } from '@/utils/supabase/client';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type Job } from '../../lib/types';

type JobsResponse = {
    jobs: Job[],
    count: number
}

// TODO: add request parameters 
// so I can implement search, pagination & limit, etc
// also research possible ways to add react query in here too
// TODO: write this hook to handle all querying info - search, pagination, ordering, etc
export function useJobs(options?: JobFetchOptions): UseQueryResult<JobsResponse> {
    const initialJobs = options?.initialData ?? []
    const client = createClient()
    return useQuery(['jobs'],
        () => getJobs(client, options),
        { initialData: { jobs: initialJobs, count: initialJobs.length } }
    )
}