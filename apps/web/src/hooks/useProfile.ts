import { type Profile } from '@lib/types';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type SupabaseClient } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { type Database } from 'lib/database.types';

async function fetchProfile(client: SupabaseClient<Database>, userId: string) {
    if (!userId) throw new Error('User is not logged in');
    const { data, error } = await client.from('profiles').select('*').eq('id', userId).single();
    if (error) throw error;
    return data;
}

export function useProfile(userId: string, initialData: Profile) {
    const client = useSupabaseClient<Database>();
    return useQuery(['profile'], () => fetchProfile(client, userId), { initialData })
}