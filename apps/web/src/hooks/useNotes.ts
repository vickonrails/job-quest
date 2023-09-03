import { useSupabaseClient, type SupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from '../../lib/database.types';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { type Note } from 'lib/types';

async function getNotes(client: SupabaseClient<Database>, jobId?: string) {
    // TODO: Add the ability to sort the notes by created_at
    let query = client.from('notes').select().order('created_at', { ascending: false });
    if (jobId) query = query.eq('jobid', jobId)
    const { data, error } = await query;
    if (error) throw error;
    return data
}

export function useNotes({ jobId }: { jobId?: string }): UseQueryResult<Note[]> {
    const client = useSupabaseClient<Database>();
    return useQuery(
        ['notes', jobId],
        () => getNotes(client, jobId)
    )
}