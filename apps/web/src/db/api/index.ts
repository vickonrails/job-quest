import { createClient } from '@/utils/supabase/server';
import { unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';
import { fetchUserProfileQuery } from '../queries/auth';
import { fetchAllJob, fetchCoverLetter, fetchJob, fetchResume } from '../queries/jobs';
import { fetchEducation, fetchProjects, fetchResumes, fetchWorkExperience } from '../queries/resume';

export async function getResume(resumeId: string) {
    const client = createClient();
    const { data: { user } } = await getUser();
    if (!user) {
        redirect('/auth')
    }
    const userId = user.id
    const tags = ['resumes', resumeId]

    return unstable_cache(
        async (resumeId, userId) => await fetchResume(client, { resumeId, userId }),
        tags,
        { tags: [`resumes-${resumeId}`] }
    )(resumeId, userId,)
}

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

    return await fetchAllJob(client, user.id)
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

export async function getWorkExperience() {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }
    return unstable_cache(
        async () => await fetchWorkExperience(client, user.id),
        ['workExperiences'],
        { tags: ['workExperiences'] }
    )()
}

export async function getEducation() {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }
    return unstable_cache(
        async () => await fetchEducation(client, user.id),
        ['education'],
        { tags: ['education'] }
    )()
}

export async function getProjects() {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }
    return unstable_cache(
        async () => await fetchProjects(client, user.id),
        ['projects'],
        { tags: ['projects'] }
    )()
}

export async function getCoverLetter(jobId: string) {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }
    return unstable_cache(
        async () => await fetchCoverLetter(client, user.id, jobId),
        ['cover-letters', jobId],
        { tags: [`cover-letters-${jobId}`] }
    )()
}

export async function getResumes() {
    const client = createClient();
    const { data: { user } } = await getUser();
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