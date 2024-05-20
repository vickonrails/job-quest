'use server'

import { createClient } from '@/utils/supabase/server';
import { type Job } from 'lib/types';
import { revalidateTag } from 'next/cache';
import { v4 as uuid } from 'uuid';

// TODO: remove the userId
export async function updateJob(job: Job, userId: string) {
    const client = createClient()
    const isNew = !Boolean(job.id)
    if (!job.id) {
        job.id = uuid();
    }

    try {
        if (isNew) {
            const { data: count } = await client
                .from('jobs')
                .select('*')
                .order('order_column', { ascending: false })
                .eq('status', job.status ?? 0)
                .eq('user_id', userId)
                .limit(1).single();

            const maxColumn = !count ? 0 : count?.order_column;
            job.order_column = maxColumn ? maxColumn + 10 : 10;
        }
        // FIX: turns out this fails if there are no jobs in the database
        const { error } = await client.from('jobs').upsert({ ...job, user_id: userId }).eq('id', job.id)
        if (error) throw error

        revalidateTag(`jobs-${job.id}`)
        revalidateTag('jobs')
        return { success: true }

    } catch (error) {
        return { success: false, error }
    }
}

export async function deleteJob(id: string) {
    try {
        const client = createClient()
        const { error } = await client.from('jobs').delete().eq('id', id);
        if (error) throw error
        revalidateTag('jobs')
        return { success: true }
    } catch (error) {
        return { success: false, error }
    }
}