import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { fetchResume } from '../queries/jobs.query';
import { fetchResumes } from '../queries/resume.query';

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
    return await fetchResume(client, { resumeId, userId })
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
    return await fetchResumes(client, userId)
}