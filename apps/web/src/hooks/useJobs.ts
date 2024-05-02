import { type SupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from 'shared';
import { type Job } from '../../lib/types';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { createClient } from '@lib/supabase/component'

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

async function getJobs(client: SupabaseClient<Database>, userId: string, options: Options) {
    const { params, jobId } = options ?? {}
    let query = client.from('jobs').select('*', { count: 'exact' }).eq('user_id', userId);

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
export function useJobs(userId: string, options?: Options, jobId?: string): UseQueryResult<JobsResponse> {
    const client = createClient();
    const { initialData } = options ?? {}

    return useQuery(
        ['jobs', jobId ?? ''],
        () => getJobs(client, userId, { ...options, jobId } ?? {}),
        { initialData: { jobs: initialData ?? [], count: initialData?.length ?? 0 } }
    )
}