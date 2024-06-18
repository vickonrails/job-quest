'use server'

import { handleApiError } from '@/utils/error-response';
import { createClient } from '@/utils/supabase/server';
import { type Education, type Project, type Resume, type ResumeInsert, type WorkExperience } from 'lib/types';
import { revalidateTag } from 'next/cache';

export async function updateResume(resume: Resume) {
    try {
        const client = createClient()
        const { data: { user } } = await client.auth.getUser()
        if (!user) throw new Error('Not Authenticated')
        const { error } = await client.from('resumes').upsert(resume);
        if (error) throw new Error(error.message)
        revalidateTag(`resumes_${user.id}`)
        return { success: true, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export async function updateWorkExperiences(workExperience: WorkExperience[], resumeId: string) {
    const client = createClient();
    try {
        const { data: { user } } = await client.auth.getUser()
        if (!user) throw new Error('Not authenticated')
        const preparedWorkExperience = workExperience.map((experience) => {
            experience.resume_id = resumeId
            return experience
        });
        const { error } = await client.from('work_experience').upsert(preparedWorkExperience).eq('user_id', user.id).select()
        if (error) throw new Error(error.message);
        revalidateTag(`workExperiences-${user.id}`)
        return { success: true, error: null }
    } catch (error) {
        return handleApiError(error)
    }
}

export async function updateEducation(education: Education[], resumeId?: string) {
    const client = createClient()
    const { data: { user } } = await client.auth.getUser()
    try {
        if (!user) throw new Error('Not authenticated')
        const preparedEducation = education.map((education) => {
            education.resume_id = resumeId ?? null;
            education.user_id = user.id;

            // TODO: figure out this
            // if ((education.still_studying_here && education.end_date) || !education.end_date) {
            //     education.end_date = null
            // }
            return education
        })

        const { error } = await client.from('education').upsert(preparedEducation);
        if (error) throw new Error(error.code);
        // TODO: if I update from the resume or profile, do I need to revalidate all other places? 
        revalidateTag(`education_${user.id}`)
        return { success: true }
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message }
        } else {
            return { success: false, error: 'An error occurred' }
        }
    }
}

export async function updateProjects(projects: Project[], resumeId: string) {
    const client = createClient();
    try {
        const { error } = await client.from('projects').upsert(projects).eq('resume_id', resumeId)
        if (error) throw error
        revalidateTag('projects')
        return { success: true }
    } catch (error) {
        return { success: false, error }
    }
}

export async function deleteWorkExperience(workExperienceId: string, userId: string) {
    const client = createClient();
    try {
        const { error } = await client.from('work_experience').delete().eq('id', workExperienceId).eq('user_id', userId)
        if (error) throw error
        revalidateTag('workExperiences')
        return { success: true }
    } catch (error) {
        return { success: false, error }
    }
}

export async function createResumeFromProfile() {
    const client = createClient()
    const { data: { user } } = await client.auth.getUser()
    try {
        if (!user) throw new Error('Not authenticated')
        const { data: profile } = await client.from('profiles').select().eq('id', user.id).single()
        if (!profile) throw new Error();
        const resume: ResumeInsert = {
            full_name: profile?.full_name,
            email_address: profile.email_address,
            github_url: profile.github_url,
            professional_summary: profile.professional_summary,
            skills: profile.skills,
            user_id: user.id,
            title: profile.title,
            linkedin_url: profile.linkedin_url,
            location: profile.location,
            personal_website: profile.personal_website
        }
        const { data } = await client.from('resumes').insert(resume).select().single()
        revalidateTag(`resumes-${user.id}`)
        return { success: true, data }
    } catch (error) {
        return { success: true, error }
    }
}

export async function deleteResume(resumeId: string) {
    const client = createClient()
    const { data: { user } } = await client.auth.getUser()
    try {
        if (!user) throw new Error('Not authorized')
        const { error } = await client.from('resumes').delete().eq('id', resumeId)
        if (error) throw error
        revalidateTag(`resumes-${user.id}`)
        return { success: true }
    } catch (error) {
        return { success: true, error }
    }
}