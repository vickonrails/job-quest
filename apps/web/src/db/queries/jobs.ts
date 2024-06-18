import { type Client } from '@/queries';
import { type Job, type Resume, type ResumeInsert } from 'lib/types';
import { getUserProfile } from '../api/profile';

type SortDirection = 'asc' | 'desc'

export interface JobFetchOptions {
    params?: {
        search?: string;
        limit?: number
        orderBy?: { field: string, direction: SortDirection }
        offset?: number
    },
    initialData?: Job[],
    jobId?: string
}

export function fetchJob(client: Client, jobId: string, userId: string) {
    return client.from('jobs').select('*').eq('id', jobId).eq('user_id', userId).single().throwOnError()
}

export function fetchAllJob(client: Client, userId: string) {
    return client.from('jobs').select('id, position, priority, status, order_column, location, company_name').eq('user_id', userId).throwOnError()
}

export async function fetchResume(client: Client, options: { userId: string, resumeId: string }) {
    let resume: Resume | null = null;
    const resumeFromDb = await client.from('resumes')
        .select().eq('user_id', options.userId)
        .eq('id', options.resumeId).single()

    resume = resumeFromDb.data

    if (!resume) {
        const { data: userProfile } = await getUserProfile()
        if (!userProfile) return;
        const resumeToCreate: ResumeInsert = {
            title: userProfile?.title ?? '',
            skills: userProfile?.skills ?? [],
            full_name: userProfile?.full_name ?? '',
            professional_summary: userProfile?.professional_summary ?? '',
            linkedin_url: userProfile?.linkedin_url ?? '',
            email_address: userProfile?.email_address ?? '',
            personal_website: userProfile?.personal_website ?? '',
            github_url: userProfile?.github_url ?? '',
            location: userProfile?.location ?? '',
            user_id: options.userId
        }
        const { data } = await client.from('resumes').insert(resumeToCreate).select('*').single();
        resume = data
    }

    return resume
}

export async function getJobs(client: Client, options?: JobFetchOptions) {
    const { params, jobId } = options ?? {}
    const { data: { user } } = await client.auth.getUser()
    if (!user?.id) throw new Error('userId not provided')

    // TODO: find a way to filter fields
    let query = client.from('jobs').select('*', { count: 'exact' }).eq('user_id', user?.id);

    if (params?.search) {
        query = query.ilike('position', `%${params.search}%`)
    }

    if (jobId) {
        query = query.eq('id', jobId)
    }

    if (params?.orderBy) {
        query = query.order(params.orderBy.field, { ascending: params.orderBy.direction === 'asc' })
    }

    if (params?.limit) {
        query = query.range(params?.offset ?? 0, (params.limit - 1) + (params.offset ?? 0))
    }

    const { count, data: jobs, error } = await query;
    if (error) throw error;
    return { jobs, count }
}

export async function fetchCoverLetter(client: Client, userId: string, jobId: string) {
    const { data } = await client.from('cover_letters').select().eq('user_id', userId).eq('job_id', jobId).single()
    if (!data) {
        const { data, error } = await client.from('cover_letters').insert({ user_id: userId, job_id: jobId, text: '' }).select().single();
        if (error) throw error
        return data
    }

    return data
}