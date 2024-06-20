import { type Client } from '@/queries';

export async function fetchWorkExperienceQuery(client: Client, options: { userId: string, resumeId?: string | null }) {
    const { userId, resumeId } = options
    let query = client.from('work_experience').select().eq('user_id', userId).throwOnError()
    if (resumeId === null) {
        query = query.filter('resume_id', 'is', null)
    } else if (resumeId !== undefined) {
        query = query.filter('resume_id', 'eq', resumeId)
    }

    return (await query).data
}

export async function fetchEducation(client: Client, options: { userId: string, resumeId?: string | null }) {
    const { userId, resumeId } = options
    let query = client.from('education').select().eq('user_id', userId).throwOnError()
    if (resumeId === null) {
        query = query.filter('resume_id', 'is', null)
    } else if (resumeId !== undefined) {
        query = query.filter('resume_id', 'eq', resumeId)
    }
    return (await query).data
}

export async function fetchProjects(client: Client, options: { userId: string, resumeId?: string | null }) {
    const { userId, resumeId } = options
    let query = client.from('projects').select('*').eq('user_id', userId).throwOnError()
    if (resumeId === null) {
        query = query.filter('resume_id', 'is', null)
    } else if (resumeId !== undefined) {
        query = query.filter('resume_id', 'eq', resumeId)
    }
    return (await query).data
}

export async function deleteWorkExperience(client: Client, experienceId: string, userId: string) {
    return await client.from('work_experience').delete().eq('id', experienceId).eq('user_id', userId)
}

export async function fetchResumes(client: Client, userId: string) {
    return (await client.from('resumes').select().eq('user_id', userId)).data
}