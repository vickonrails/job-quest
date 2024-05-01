import { createClient } from '@lib/supabase/component';
import { type Profile } from '@lib/types';
import { type SupabaseClient } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { type Database } from 'shared';

async function fetchProfile(client: SupabaseClient<Database>, userId: string) {
    if (!userId) throw new Error('User is not logged in');
    const { data, error } = await client.from('profiles').select('*').eq('id', userId).single();
    if (error) throw error;
    return data;
}

export function useProfile(userId: string, initialData: Profile) {
    const client = createClient();
    return useQuery(['profile'], () => fetchProfile(client, userId), { initialData })
}