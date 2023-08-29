import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type SupabaseClient, type User } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { type Database } from 'lib/database.types';

async function fetchProfile(client: SupabaseClient<Database>, user: User) {
    if (!user) throw new Error('User is not logged in');
    const { data, error } = await client.from('profiles').select('*').eq('id', user?.id).single();
    if (error) throw error;
    return data;
}

export function useProfile(user: User) {
    const client = useSupabaseClient<Database>();
    return useQuery(['profile'], () => fetchProfile(client, user))
}