import { type Client } from '@/queries';

export async function fetchWorkExperience(client: Client, options: { userId: string, resumeId?: string | null }) {
    const { userId, resumeId } = options
    const query = client.from('work_experience').select().eq('user_id', userId).throwOnError()
    if (options.resumeId !== undefined) {
        query.filter('resume_id', 'is', resumeId)
    }
    return (await query).data
}

export async function fetchProfileWorkExperience(client: Client, userId: string) {
    return (await client.from('work_experience').select().eq('user_id', userId).filter('resume_id', 'is', null).throwOnError()).data
}

export async function fetchEducation(client: Client, options: { userId: string, resumeId?: string | null }) {
    const { userId, resumeId } = options
    const query = client.from('education').select().eq('user_id', userId).throwOnError()
    if (options.resumeId !== undefined) {
        query.filter('resume_id', 'is', resumeId)
    }
    return (await query).data
}

export async function fetchProjects(client: Client, options: { userId: string, resumeId?: string | null }) {
    const { userId, resumeId } = options
    const query = client.from('projects').select('*').eq('user_id', userId).throwOnError()
    if (options.resumeId !== undefined) {
        query.filter('resume_id', 'is', resumeId)
    }
    return (await query).data
}

export async function deleteWorkExperience(client: Client, experienceId: string, userId: string) {
    return await client.from('work_experience').delete().eq('id', experienceId).eq('user_id', userId)
}

export async function fetchResumes(client: Client, userId: string) {
    return (await client.from('resumes').select().eq('user_id', userId)).data
}