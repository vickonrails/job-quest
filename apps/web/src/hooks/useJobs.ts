import { useSupabaseClient, type SupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from '../../lib/database.types';
import { type Job } from '../../lib/types';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';

interface Options {
    params?: {
        search?: string;
        limit?: number
        orderBy?: { field: string, direction: 'asc' | 'desc' }
    }
}

async function getJobs(client: SupabaseClient<Database>, options?: Options) {
    const { params } = options ?? {}
    let query = client.from('jobs').select();

    if (params?.search) {
        query = query.ilike('position', `%${params.search}%`)
    }

    if (params?.limit) {
        query = query.limit(params.limit)
    }

    if (params?.orderBy) {
        query = query.order(params.orderBy.field, { ascending: params.orderBy.direction === 'asc' })
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

// TODO: add request parameters 
// so I can implement search, pagination & limit, etc
// also research possible ways to add react query in here too
export function useJobs(options?: Options, key?: string): UseQueryResult<Job[]> {
    const client = useSupabaseClient<Database>();
    const res = useQuery(
        ['jobs', key],
        () => getJobs(client, options)
    )
    return res;
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