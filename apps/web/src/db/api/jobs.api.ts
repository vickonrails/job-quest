'use server'

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { fetchAllJob, fetchCoverLetter, fetchJob } from '../queries/jobs.query';

import { type CoverLetter, type Job } from 'lib/types';
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

        return { success: true }

    } catch (error) {
        return { success: false, error }
    }
}

export async function deleteJob(id: string) {
    try {
        const client = createClient()
        const { error } = await client.from('jobs').delete().eq('id', id);
        if (error) throw new Error(error.message)
        return { success: true }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'An error occurred' }
    }
}

export async function updateCoverLetter(coverLetter: CoverLetter, userId: string, jobId: string) {
    const client = createClient();
    try {
        const { error } = await client.from('cover_letters').upsert(coverLetter).eq('user_id', userId).eq('job_id', jobId);
        if (error) throw error
        return { success: true }
    } catch (error) {
        return { success: false, error }
    }
}

/**
 * fetch summary card data
 * TODO: cache this data
 */
export async function getSummaryCardData() {
    const client = createClient()
    const { data: { user } } = await client.auth.getUser()
    if (!user) throw new Error('unauthorized');

    const { data, error } = await client.rpc('get_job_stage_counts', { userid: user.id }).single()
    if (error) throw error
    return data
}

/**
 * fetch cover letter for job
 */
export async function getCoverLetter(jobId: string) {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }
    return await fetchCoverLetter(client, user.id, jobId)
}

/**
 * fetch job with id
 */
export async function getJob(jobId: string) {
    const client = createClient()
    // TODO: replace with a cached user
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }
    return await fetchJob(client, jobId, user.id)
}

/**
 * getch all jobs for current user
 * TODO: cache this data
 */
export async function getJobs() {
    const client = createClient()
    // TODO: replace with a cached user
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
        redirect('/auth')
    }

    return await fetchAllJob(client, user.id)
}