import { type Client } from '@/queries'

/**
 * 
 * @param client 
 * @param options 
 * @returns 
 */
export function fetchUserProfileQuery(client: Client, userId: string) {
    return client.from('profiles').select().eq('id', userId).single().throwOnError()
}