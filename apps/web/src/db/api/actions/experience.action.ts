'use server'

import { createClient } from '@/utils/supabase/server';
import { type WorkExperience } from 'lib/types';
import { redirect } from 'next/navigation';
import { v4 as uuid } from 'uuid'

export async function deleteWorkExperience(id: string) {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }

    try {
        const { error } = await client.from('work_experience').delete().eq('id', id)
        if (error) throw new Error(error.message)
        // TODO: can we use this deleteProfileExperience function in other places? like the resume builder?
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message)
        }
    }
}

// TODO: will this be valid when I update work experience anywhere at all? 
// like profile or resume builder
export async function updateWorkExperience({ values }: { values: WorkExperience[] }) {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }

    try {
        const preparedValues = values.map(work => {
            if (!work.id) work.id = uuid()
            work.user_id = user.id

            // TODO: still fix this logic
            if ((work.still_working_here && work.end_date) || !work.end_date) {
                work.end_date = null
            }
            return work
        })

        const { error } = await client.from('work_experience').upsert(preparedValues)
        if (error) throw new Error(error.message)
        return { success: true }
    } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'An error occurred' }
    }
}