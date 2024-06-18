'use server'

import { createClient } from '@/utils/supabase/server';
import { type Profile } from 'lib/types';
import { revalidateTag } from 'next/cache';

export async function updateProfile({ profile }: { profile: Profile }) {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser();
    try {
        if (!user) throw new Error('User not found')
        const { error } = await client.from('profiles').update({ ...profile, id: user.id }).eq('id', user.id);
        if (error) throw error
        revalidateTag(`profiles_${user.id}`)
        return { success: true }
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message }
        } else {
            return { success: false, error: 'An error occurred' }
        }
    }
}