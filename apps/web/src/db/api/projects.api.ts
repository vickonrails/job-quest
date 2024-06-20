import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { fetchProjects } from '../queries/resume.query';

export async function getProjects() {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }
    return await fetchProjects(client, { userId: user.id })
}

export async function getProfileProjects() {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }
    return await fetchProjects(client, { userId: user.id, resumeId: null })
}
