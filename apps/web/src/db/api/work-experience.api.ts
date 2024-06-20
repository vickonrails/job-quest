import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { fetchWorkExperienceQuery } from '../queries/resume.query';

export async function getProfileWorkExperience() {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }
    return await fetchWorkExperienceQuery(client, { userId: user.id, resumeId: null })
}

export async function getWorkExperience() {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }

    return await fetchWorkExperienceQuery(client, { userId: user.id })
}