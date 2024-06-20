'use server'

import { updateProfileQuery } from '@/db/queries/profile.query';
import { createClient } from '@/utils/supabase/server';
import { type Profile } from 'lib/types';

export async function updateProfile({ profile }: { profile: Profile }) {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser();
    try {
        if (!user) throw new Error('User not found')
        const { error } = await updateProfileQuery(client, { profile, id: user.id });

        if (error) throw error
        return { success: true }
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message }
        } else {
            return { success: false, error: 'An error occurred' }
        }
    }
}