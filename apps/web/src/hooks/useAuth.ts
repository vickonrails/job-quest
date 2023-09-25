import { useSupabaseClient, type SupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { type Database } from 'lib/database.types';

async function fetchUser(client: SupabaseClient<Database>) {
    const { data, error } = await client.auth.getUser();
    if (error) throw error;
    return data;
}

export function useAuth() {
    const client = useSupabaseClient<Database>();
    return useQuery(['auth'], () => fetchUser(client))
}