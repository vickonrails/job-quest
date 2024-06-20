import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { fetchEducation } from '../queries/resume';

export async function getProfileEducation({ resumeId }: { resumeId?: string | null }) {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }

    return await fetchEducation(client, { userId: user.id, resumeId })
}

export async function getEducation({ resumeId }: { resumeId?: string | null }) {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }

    return await fetchEducation(client, { userId: user.id, resumeId })
}