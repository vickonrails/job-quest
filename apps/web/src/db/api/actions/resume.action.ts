'use server'

import { createClient } from '@/utils/supabase/server';
import { type Education, type ResumeInsert } from 'lib/types';

// TODO: can't nuke cause it's been used in the profile setup
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
        return { success: true }
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message }
        } else {
            return { success: false, error: 'An error occurred' }
        }
    }
}

export async function deleteWorkExperience(workExperienceId: string, userId: string) {
    const client = createClient();
    try {
        const { error } = await client.from('work_experience').delete().eq('id', workExperienceId).eq('user_id', userId)
        if (error) throw error
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
        return { success: true }
    } catch (error) {
        return { success: true, error }
    }
}