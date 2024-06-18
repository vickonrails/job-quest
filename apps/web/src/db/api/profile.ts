import { createClient } from '@/utils/supabase/server'
import { unstable_cache } from 'next/cache'
import { redirect } from 'next/navigation'
import { fetchUserProfileQuery } from '../queries/auth'

/**
 * Fetches the currently logged in user's profile
 */
export async function getUserProfile() {
    const client = createClient()
    // TODO: replace with a cached user
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }

    return unstable_cache(
        async (userId) => await fetchUserProfileQuery(client, userId),
        [`profiles_${user.id}`],
        { tags: [`profiles_${user.id}`] }
    )(user.id)
}

/**
 *  get logged in user
 * @returns
 */
export function getUser() {
    const client = createClient();
    return unstable_cache(
        async () => await client.auth.getUser(),
        ['user'],
        { tags: ['user'] }
    )()
}