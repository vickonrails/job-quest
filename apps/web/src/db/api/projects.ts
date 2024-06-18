import { createClient } from '@/utils/supabase/server';
import { unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';
import { fetchProjects } from '../queries/resume';

export async function getProjects({ resumeId }: { resumeId?: string | null }) {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }
    return unstable_cache(
        async () => await fetchProjects(client, { userId: user.id, resumeId }),
        ['projects', user.id],
        { tags: [`projects_${user.id}`] }
    )()
}
