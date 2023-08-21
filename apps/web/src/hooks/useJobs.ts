import { type SupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from '../../lib/database.types';
import { type Job } from '../../lib/types';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';

async function getJobs(client: SupabaseClient<Database>) {
    const { data, error } = await client.from('jobs').select();
    if (error) throw error;
    return data;
}

// TODO: add request parameters 
// so I can implement search, pagination & limit, etc
// also research possible ways to add react query in here too
export function useJobs(client: SupabaseClient<Database>): UseQueryResult<Job[]> {
    return useQuery(
        ['jobs'],
        () => getJobs(client)
    )
}

async function getJob(client: SupabaseClient<Database>, id: string) {
    const { data, error } = await client.from('jobs').select().eq('id', id);
    if (error) throw error;
    return data;
}

// TODO: convert this function to use a more generic param query
// TODO: we might need to merge these two functions into one with the parameters under the hood
export function useJob(client: SupabaseClient<Database>, id: string): UseQueryResult<Job[]> {
    return useQuery(
        ['job', id],
        () => getJob(client, id)
    )
}