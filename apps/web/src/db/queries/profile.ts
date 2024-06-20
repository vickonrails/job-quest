import { type Client } from '@/queries';
import { type Profile } from 'lib/types';

export async function updateProfileQuery(client: Client, options: { id: string, profile: Profile }) {
    return await client.from('profiles').upsert(options.profile).eq('id', options.id)
}