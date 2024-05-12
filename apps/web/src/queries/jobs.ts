import { createClient } from '@/utils/supabase/server';
import { type Client } from '.';
import { getUser } from '@/db/api';

type SortDirection = 'asc' | 'desc'

interface Options {
    params?: {
        search?: string;
        limit?: number
        orderBy?: { field: string, direction: SortDirection }
        offset?: number
    },
    jobId?: string
    userId: string
}

type QueryProps = {
    orderBy: {
        field: string,
        direction: 'asc' | 'desc'
    },
    status?: number
    limit?: number
    gte?: {
        field: string,
        value: number
    }
}

const defaultQuery: QueryProps = {
    orderBy: {
        direction: 'asc',
        field: 'created_at'
    },
}

export async function getJob(jobId: string) {
    const client = createClient()
    const { data: { user } } = await getUser()
    if (!user) return null;
    const { data } = await fetchJobs(client, { userId: user.id, jobId })
    return data?.[0]
}

export async function getJobs(options?: QueryProps) {
    const client = createClient()
    const { data: { user } } = await getUser()
    if (!user) return null;
    return (await fetchJobs(client, { queryProps: options ?? defaultQuery, userId: user.id })).data
}

type FetchJobsOptions = {
    queryProps?: QueryProps,
    userId: string
    jobId?: string
}

async function fetchJobs(client: Client, options: FetchJobsOptions) {
    const { queryProps, jobId, userId } = options ?? {}
    const params = queryProps
    let query = client.from('jobs').select('*', { count: 'exact' }).eq('user_id', userId);

    if (params?.orderBy) {
        query = query.order(params.orderBy.field, { ascending: params.orderBy.direction === 'asc' })
    }

    if (jobId) {
        query = query.eq('id', jobId)
    }

    if (params?.limit) {
        query = query.limit(params.limit)
    }

    if (params?.status) {
        query = query.eq('status', params.status);
    }

    if (params?.gte) {
        query = query.gte(params.gte.field, params.gte.value);
    }

    return await query
}

export async function getResumes() {
    const client = createClient();
    const { data: { user } } = await getUser();
    if (!user) return null;
    return (await fetchResumes(client, user?.id)).data
}

export async function getResume(id: string) {
    const client = createClient();
    const { data: { user } } = await getUser();
    if (!user) return null;
    return (await fetchResume(client, { resumeId: id, userId: user.id })).data
}

export async function fetchResume(client: Client, options: { userId: string, resumeId: string }) {
    return client.from('resumes').select().eq('user_id', options.userId).eq('id', options.resumeId).single()
}

export async function fetchResumes(client: Client, userId: string) {
    return client.from('resumes').select().eq('user_id', userId)
}