import { useSupabaseClient, type SupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from '../../lib/database.types';
import { type Job } from '../../lib/types';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';

type SortDirection = 'asc' | 'desc'

interface Options {
    params?: {
        search?: string;
        limit?: number
        orderBy?: { field: string, direction: SortDirection }
        offset?: number
    },
    initialData?: Job[],
    jobId?: string
}

async function getJobs(client: SupabaseClient<Database>, options: Options) {
    const { data: { user } } = await client.auth.getUser();

    if (!user) throw new Error('User not found');

    const { params, jobId } = options ?? {}
    let query = client.from('jobs').select('*', { count: 'exact' }).eq('user_id', user?.id);

    if (params?.search) {
        query = query.ilike('position', `%${params.search}%`)
    }

    if (jobId) {
        query = query.eq('id', jobId)
    }

    if (params?.orderBy) {
        query = query.order(params.orderBy.field, { ascending: params.orderBy.direction === 'asc' })
    }

    if (params?.limit) {
        query = query.range(params?.offset ?? 0, (params.limit - 1) + (params.offset ?? 0))
    }

    const { count, data: jobs, error } = await query;

    if (error) throw error;
    return { jobs, count };
}

type JobsResponse = {
    jobs: Job[],
    count: number
}

// TODO: add request parameters 
// so I can implement search, pagination & limit, etc
// also research possible ways to add react query in here too
// TODO: write this hook to handle all querying info - search, pagination, ordering, etc
export function useJobs(options?: Options, jobId?: string): UseQueryResult<JobsResponse> {
    const client = useSupabaseClient<Database>();
    const { initialData } = options ?? {}

    return useQuery(
        ['jobs'],
        () => getJobs(client, options ?? {}),
        { initialData: { jobs: initialData ?? [], count: initialData?.length ?? 0 } }
    )
}