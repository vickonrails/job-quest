import { createClient } from '@/utils/supabase/server';
import { unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';
import { fetchWorkExperience } from '../queries/resume';

export async function getWorkExperience({ resumeId }: { resumeId?: string | null }) {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }

    return unstable_cache(
        async () => await fetchWorkExperience(client, { userId: user.id, resumeId }),
        ['work_experience', user.id],
        { tags: [`work_experience_${user.id}`] }
    )()
}