import { createClient } from '@/utils/supabase/server';
import { unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';
import { fetchResume } from '../queries/jobs';
import { fetchResumes } from '../queries/resume';

// TODO: simplify to one getResumes function
/**
 * gets a resume by id
 * @param resumeId 
 */

export async function getResume(resumeId: string) {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser();
    if (!user) {
        redirect('/auth')
    }

    const userId = user.id
    const tags = ['resumes', resumeId]

    return unstable_cache(
        async (resumeId, userId) => await fetchResume(client, { resumeId, userId }),
        tags,
        { tags: [`resume_${user.id}`] }
    )(resumeId, userId,)
}

// TODO merge to one

/**
 * 
 * @returns 
 */
export async function getResumes() {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser();
    if (!user) {
        redirect('/auth')
    }
    const userId = user.id

    return unstable_cache(
        async (userId) => await fetchResumes(client, userId),
        ['resumes', userId],
        { tags: [`resumes-${userId}`] }
    )(userId)
}