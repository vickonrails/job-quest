import { useSupabaseClient, type SupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type Note } from 'lib/types';
import { type Database } from '../../lib/database.types';

async function getNotes(client: SupabaseClient<Database>, jobId?: string) {
    if (!jobId) throw new Error('Job ID is required');
    const { data, error } = await client.from('notes').select().eq('job_id', jobId);
    if (error) throw error;
    return data
}

interface NoteOptions {
    initialData?: Note[],
    jobId?: string
}

export function useNotes(options: NoteOptions): UseQueryResult<Note[]> {
    const { jobId, initialData } = options
    const client = useSupabaseClient<Database>();
    return useQuery(
        ['notes', jobId],
        () => getNotes(client, jobId),
        { initialData }
    )
}