import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { fetchProjects } from '../queries/resume';

export async function getProjects({ resumeId }: { resumeId?: string | null }) {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }
    return await fetchProjects(client, { userId: user.id, resumeId })
}
