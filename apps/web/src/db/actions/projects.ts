'use server'

import { createClient } from '@/utils/supabase/server';
import { type Project } from 'lib/types';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { v4 as uuid } from 'uuid';

export async function updateProjects({ values }: { values: Project[] }) {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }

    try {
        const preparedValues = values.map(project => {
            if (!project.id) project.id = uuid()
            project.user_id = user.id
            return project
        })

        const { error } = await client.from('projects').upsert(preparedValues)
        if (error) throw new Error(error.message)
        revalidateTag(`projects_${user.id}`)
        return { success: true }
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message }
        } else {
            return { success: false, error: 'An error occurred' }
        }
    }
}