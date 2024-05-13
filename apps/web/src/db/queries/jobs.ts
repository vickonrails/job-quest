import { type Client } from '@/queries';
import { type Job } from 'lib/types';

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

// TODO: get all jobs
// export async function fetchAllJobs(client: Client) {
//     return client.from('jobs').select('position, id, order_column')
// }

export function fetchJob(client: Client, jobId: string, userId: string) {
    return client.from('jobs').select('*').eq('id', jobId).eq('user_id', userId).single().throwOnError()
}

export function fetchAllJob(client: Client, userId: string) {
    return client.from('jobs').select('id, position, priority, status, order_column, location, company_name').eq('user_id', userId).throwOnError()
}

// export async function getJobs(client: Client, options?: JobFetchOptions) {
//     const { params, jobId } = options ?? {}
//     const { data: { user } } = await client.auth.getUser()
//     if (!user?.id) throw new Error('userId not provided')

//     // TODO: find a way to filter fields
//     let query = client.from('jobs').select('*', { count: 'exact' }).eq('user_id', user?.id);

//     if (params?.search) {
//         query = query.ilike('position', `%${params.search}%`)
//     }

//     if (jobId) {
//         query = query.eq('id', jobId)
//     }

//     if (params?.orderBy) {
//         query = query.order(params.orderBy.field, { ascending: params.orderBy.direction === 'asc' })
//     }

//     if (params?.limit) {
//         query = query.range(params?.offset ?? 0, (params.limit - 1) + (params.offset ?? 0))
//     }

//     const { count, data: jobs, error } = await query;
//     if (error) throw error;
//     return { jobs, count }
// }