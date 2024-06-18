import { createClient } from '@/utils/supabase/server';
import { unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';
import { fetchEducation } from '../queries/resume';

export async function getEducation({ resumeId }: { resumeId?: string | null }) {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }
    return unstable_cache(
        async () => await fetchEducation(client, { userId: user.id, resumeId }),
        ['education', user.id],
        { tags: [`education_${user.id}`] }
    )()
}