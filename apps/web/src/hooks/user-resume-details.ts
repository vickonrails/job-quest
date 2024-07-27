import { createClient } from '@/utils/supabase/client';
import { type SupabaseClient } from '@supabase/supabase-js';
import { useQueries } from '@tanstack/react-query';
import { type Database } from 'shared';

// TODO: we're fetching the user on every request right now, might not be the best thing
async function workExperienceQueryFn(client: SupabaseClient<Database>) {
    const { data: { user } } = await client.auth.getUser()
    if (!user) return
    return (await client.from('work_experience').select().eq('user_id', user.id)).data
}

async function resumeQueryFn(client: SupabaseClient<Database>, resumeId: string) {
    return (await client.from('resumes').select().eq('id', resumeId).single()).data
}

async function resumeProjectsQuery(client: SupabaseClient<Database>) {
    const { data: { user } } = await client.auth.getUser()
    if (!user) return
    return (await client.from('projects').select().eq('user_id', user.id)).data
}

async function resumeEducationQuery(client: SupabaseClient<Database>) {
    const { data: { user } } = await client.auth.getUser()
    if (!user) return
    return (await client.from('education').select().eq('user_id', user.id)).data
}

export function useResumeDetails(resumeId: string) {
    const client = createClient()

    const results = useQueries({
        queries: [
            { queryKey: [`resume_${resumeId}`, 'basic_info'], queryFn: async () => resumeQueryFn(client, resumeId), staleTime: 30000 },
            { queryKey: [`resume_${resumeId}`, 'work_experience'], queryFn: async () => workExperienceQueryFn(client), staleTime: 30000 },
            { queryKey: [`resume_${resumeId}`, 'education'], queryFn: async () => resumeEducationQuery(client), staleTime: 30000 },
            { queryKey: [`resume_${resumeId}`, 'projects'], queryFn: async () => resumeProjectsQuery(client), staleTime: 30000 },
        ],
    })

    return {
        isLoading: results.some(x => x.isLoading),
        data: {
            resume: results[0].data,
            workExperience: results[1].data,
            education: results[2].data,
            projects: results[3].data,
        }
    }
}