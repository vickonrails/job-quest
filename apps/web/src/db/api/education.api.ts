import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { fetchEducationQuery } from '../queries/education.query';

export async function getProfileEducation() {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }

    return await fetchEducationQuery(client, { userId: user.id, resumeId: null })
}

export async function getEducation() {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }

    return await fetchEducationQuery(client, { userId: user.id })
}