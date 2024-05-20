'use server'

import { setEntityId } from '@/utils/set-entity-id';
import { createClient } from '@/utils/supabase/server';
import { type Education, type Project, type Highlight, type Resume, type WorkExperience } from 'lib/types';
import { revalidateTag } from 'next/cache';

export async function updateResume(resume: Resume) {
    try {
        const client = createClient()
        const { error } = await client.from('resumes').upsert(resume);
        if (error) throw error
        revalidateTag(`resumes-${resume.id}`)
        return { success: true }
    } catch (error) {
        return { success: false, error }
    }
}

export async function updateWorkExperiences(workExperience: WorkExperience[], highlightsToDelete: string[], resumeId: string, userId: string) {
    const client = createClient();
    const highlightsToDeleteArr: string[] = [...highlightsToDelete];
    const highlights: WorkExperience['highlights'] = [];

    const preparedWorkExperience = workExperience.map((experience) => {
        experience.resume_id = resumeId

        if (experience.highlights) {
            highlights.push(...experience.highlights);
            delete experience.highlights;
        }

        // TODO: look more into this (when considering the experience and end date saga)
        return experience
    });

    try {
        // TODO: delete selected highlights
        if (highlightsToDeleteArr.length > 0) {
            const { error } = await client.from('highlights').delete().in('id', highlightsToDeleteArr);
            if (error) throw error
        }

        const preparedHighlights = highlights.filter(x => !highlightsToDeleteArr.includes(x.id) && x.text)
            .map(highlight => setEntityId<Highlight>(highlight, { overwrite: false }))

        const { error } = await client.from('work_experience').upsert(preparedWorkExperience).eq('user_id', userId).select()
        if (error) throw error;

        const { error: highlightsError } = await client.from('highlights').upsert(preparedHighlights).eq('user_id', userId).select();
        if (highlightsError) throw highlightsError

        return { success: true }
    } catch (error) {
        return { success: false, error }
        // TODO: handle general error
    } finally {
        revalidateTag('workExperiences') //??
    }
}

export async function updateEducation(education: Education[], highlightsToDelete: string[], resumeId: string, userId: string) {
    const client = createClient()
    const highlightsToDeleteArr: string[] = [...highlightsToDelete];
    const highlights: Education['highlights'] = [];
    const preparedEducation = education.map((education) => {
        education.resume_id = resumeId;
        if (education.highlights) {
            highlights.push(...education.highlights)
            delete education.highlights
        }

        // TODO: figure out this
        // if ((education.still_studying_here && education.end_date) || !education.end_date) {
        //     education.end_date = null
        // }
        return education
    })

    if (highlightsToDeleteArr.length > 0) {
        const result = await client.from('highlights').delete().in('id', highlightsToDeleteArr);
        if (result.error) throw result.error
    }

    const preparedHighlights = highlights.filter(x => !highlightsToDeleteArr.includes(x.id) && x.text)
        .map(highlight => setEntityId<Highlight>(highlight, { overwrite: false }))

    try {
        const { error } = await client.from('education').upsert(preparedEducation);
        if (error) throw error;

        const { error: highlightsError } = await client.from('highlights').upsert(preparedHighlights).select();
        if (highlightsError) throw highlightsError
        revalidateTag('education')
        return { success: true }
    } catch (error) {
        return { success: false, error }
        // 
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