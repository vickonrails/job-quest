import { type Client } from '@/queries';

export async function fetchWorkExperience(client: Client, userId: string) {
    return (await client.from('work_experience').select('*, highlights ( * )').eq('user_id', userId).throwOnError()).data
}

export async function fetchEducation(client: Client, userId: string) {
    return (await client.from('education').select('*, highlights ( * )').eq('user_id', userId).throwOnError()).data
}

export async function fetchProjects(client: Client, userId: string) {
    return (await client.from('projects').select('*').eq('user_id', userId).throwOnError()).data
}

export async function deleteWorkExperience(client: Client, experienceId: string, userId: string) {
    return await client.from('work_experience').delete().eq('id', experienceId).eq('user_id', userId)
}