'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteEducation(id: string) {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser()
    if (!user) redirect('/auth')

    try {
        const { error } = await client.from('education').delete().eq('id', id)
        if (error) throw new Error(error.message)
        revalidateTag(`education_${user.id}`)
        // TODO: can we use this deleteProfileExperience function in other places? like the resume builder?
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message)
        }
    }
}