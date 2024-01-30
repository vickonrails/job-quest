import { useSupabaseClient, type SupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type Note } from 'lib/types';
import { type Database } from '../../lib/database.types';

async function getNotes(client: SupabaseClient<Database>, jobId?: string) {
    // TODO: Add the ability to sort the notes by created_at
    let query = client.from('notes').select().order('created_at', { ascending: false });
    if (jobId) query = query.eq('job_id', jobId)
    const { data, error } = await query;
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