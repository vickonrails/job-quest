import { createClient } from '@/utils/supabase/server';
import { type Client } from '.';
import { unstable_cache } from 'next/cache';

type ProfileQueryOptions = { userId: string }

/**
 * 
 * @param client 
 * @param options 
 * @returns 
 */
export const fetchUserProfileQuery = async (client: Client, options: ProfileQueryOptions) => {
    const response = await client.from('profiles').select().eq('id', options.userId).single()
    return response
}


/**
 * 
 */
export const getUserProfile = async () => {
    const client = createClient();
    const response = await getUser()
    const user = response.user
    if (!user) return null;
    const { data } = await fetchUserProfileQuery(client, { userId: user.id })
    return data
}


/**
 * 
 * @param client 
 * @returns 
 */
export const fetchUserQuery = async (client: Client) => {
    return (await client.auth.getUser()).data
}

/**
 * 
 */
const getUser = async () => {
    const client = createClient();
    return await fetchUserQuery(client)

    // if (!user) return null;
    // return unstable_cache(fetchUserQuery, ['user'])(client)
}