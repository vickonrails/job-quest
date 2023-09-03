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
    }
}

async function getJobs(client: SupabaseClient<Database>, options?: Options) {
    const { params } = options ?? {}
    let query = client.from('jobs').select('*', { count: 'exact' });

    if (params?.search) {
        query = query.ilike('position', `%${params.search}%`)
    }

    if (params?.orderBy) {
        query = query.order(params.orderBy.field, { ascending: params.orderBy.direction === 'asc' })
    }

    if (params?.limit) {
        query = query.range(params?.offset ?? 0, (params.limit - 1) + (params.offset ?? 0))
    }

    const { count, data: jobs, error } = await query;

    if (error) throw error;
    return { count, jobs };
}

type JobsResponse = {
    jobs: Job[],
    count: number
}

// TODO: add request parameters 
// so I can implement search, pagination & limit, etc
// also research possible ways to add react query in here too
// TODO: write this hook to handle all querying info - search, pagination, ordering, etc
export function useJobs(options?: Options, key?: string): UseQueryResult<JobsResponse> {
    const client = useSupabaseClient<Database>();
    return useQuery(
        ['jobs', key, options?.params],
        () => getJobs(client, options)
    )
}

async function getJob(client: SupabaseClient<Database>, id: string) {
    const { data, error } = await client.from('jobs').select().eq('id', id).single();
    // add different conditions for different params
    // filtering? add an additional .eq or .in
    // filtering? add an additional .eq or .in
    if (error) throw error;
    return data;
}

// TODO: convert this function to use a more generic param query
// TODO: we might need to merge these two functions into one with the parameters under the hood
export function useJob(id: string): UseQueryResult<Job> {
    const client = useSupabaseClient<Database>();
    return useQuery(
        ['job', id],
        () => getJob(client, id)
    )
}