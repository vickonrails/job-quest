'use server'

import { createClient } from '@/utils/supabase/server';
import { type Profile } from 'lib/types';
import { revalidateTag } from 'next/cache';

export async function updateProfile({ profile, userId }: { profile: Profile, userId: string }) {
    const client = createClient();
    try {
        const { error } = await client.from('profiles').update({ ...profile, id: userId }).eq('id', userId);
        if (error) throw error
        revalidateTag(`profiles_${userId}`)
        return { success: true }
    } catch {
        return {
            success: false
        }
    }
}