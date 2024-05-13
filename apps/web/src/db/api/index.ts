import { createClient } from '@/utils/supabase/server';
import { unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';
import { fetchUserProfileQuery } from '../queries/auth';
import { fetchAllJob, fetchJob } from '../queries/jobs';

export async function getJob(jobId: string) {
    const client = createClient()
    // TODO: replace with a cached user
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }
    const tags = ['jobs', jobId]
    return unstable_cache(
        async (jobId) => await fetchJob(client, jobId, user.id),
        tags,
        { tags: [tags.join('-')] }
    )(jobId)
}

export async function getJobs() {
    const client = createClient()
    // TODO: replace with a cached user
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }
    const tags = ['jobs']
    return unstable_cache(
        async () => await fetchAllJob(client, user.id),
        tags,
        { tags }
    )()
}

export async function getUserProfile() {
    const client = createClient()
    // TODO: replace with a cached user
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }
    const tags = ['profile', user.id]
    return unstable_cache(
        async (userId) => await fetchUserProfileQuery(client, userId),
        tags,
        { tags: [tags.join('-')] }
    )(user.id)
}

export function getUser() {
    const client = createClient();
    return unstable_cache(
        async () => await client.auth.getUser(),
        ['user'],
        { tags: ['user'] }
    )()
}