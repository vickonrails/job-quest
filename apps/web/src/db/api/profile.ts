import { createClient } from '@/utils/supabase/server'
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
    return await fetchUserProfileQuery(client, user.id)
}

/**
 *  get logged in user
 * @returns
 */
export async function getUser() {
    const client = createClient();
    return await client.auth.getUser()
}