import { useSupabaseClient, type SupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { type Database } from '../../lib/database.types';
import { type Job } from '../../lib/types';

export type SortDirection = 'asc' | 'desc'
export type Sort = { field: string, direction: SortDirection }

export const DEFAULT_LIMIT = 10;
export const DEFAULT_OFFSET = 0;
export const DEFAULT_SORTING: Sort = { field: 'created_at', direction: 'desc' }

export interface QueryParams {
    search?: string;
    limit?: number
    orderBy?: Sort
    offset: number
}

interface Options {
    queryParams?: QueryParams
    jobId?: string
}

interface UseJobsOptions {
    initialData: Job[]
}

async function getJobs(client: SupabaseClient<Database>, options: Options) {
    const { data: { user } } = await client.auth.getUser();

    if (!user) throw new Error('User not found');

    const { queryParams: params, jobId } = options ?? {}
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
    return { jobs, count };
}

export function parseSorting(sort: string) {
    if (!sort) return;

    const [field, direction] = sort?.split(',');
    if (!field || !direction) return;

    return { field, direction: direction as SortDirection }
}

function stringifySorting(sort: Sort) {
    return `${sort.field},${sort.direction}`
}

// TODO: add request parameters 
// so I can implement search, pagination & limit, etc
// also research possible ways to add react query in here too
// TODO: write this hook to handle all querying info - search, pagination, ordering, etc
export function useJobs(options?: UseJobsOptions, jobId?: string) {
    // TODO: I have a problem with the isRefetching property for many reasons
    // one of them is that it fires for every type of refetch, not just the one I want
    // I could introduce a property that just fires for the ones I want. Like changing the limit, next page & changing sort order
    const client = useSupabaseClient<Database>();
    const router = useRouter();

    const [queryParams, setParams] = useState<QueryParams>({
        limit: router.query.limit ? Number(router.query.limit) : DEFAULT_LIMIT,
        offset: router.query.offset ? Number(router.query.offset) : DEFAULT_OFFSET,
        orderBy: parseSorting(router.query.orderBy as string) ?? DEFAULT_SORTING,
    });

    const setQueryParams = (params: QueryParams) => {
        const newURL = new URL(window.location.href)
        const newParams: QueryParams = {
            limit: params.limit ?? DEFAULT_LIMIT,
            offset: params.offset ?? 0,
            orderBy: params.orderBy ?? queryParams.orderBy ?? DEFAULT_SORTING,
        }

        if (newParams.limit)
            newURL.searchParams.set('limit', newParams.limit.toString())

        if (newParams.offset)
            newURL.searchParams.set('offset', (newParams.offset ?? 0).toString())

        if (newParams.orderBy) {
            const value = stringifySorting(newParams.orderBy)
            newURL.searchParams.set('orderBy', value);
        }

        setParams(newParams);
        window.history.pushState(newParams, '', newURL);
    }

    const queryResult = useQuery(
        ['jobs', { queryParams }],
        () => getJobs(client, { queryParams }),
        { initialData: { jobs: options?.initialData ?? [], count: options?.initialData?.length ?? 0 } }
    )

    return {
        ...queryResult,
        setQueryParams,
        queryParams
    }
}