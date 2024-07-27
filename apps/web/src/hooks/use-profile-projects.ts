import { type SupabaseClient } from '@supabase/auth-helpers-react';
import { type Project } from 'lib/types';
import { useEffect, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { type Database } from 'shared';
import { v4 as uuid } from 'uuid';

// TODO: quite specific to the profile setup wizard, refactor if needed elsewhere
export function useProfileProjects({ projects }: { projects: Project[] }) {
    const rows = useMemo(() => {
        return projects.length > 0 ? projects : [getDefaultProject({ userId: '' })]
    }, [projects])
    const form = useForm<{ projects: Project[] }>({
        defaultValues: { projects: rows },
        mode: 'onChange'
    })

    const fieldsArr = useFieldArray({
        name: 'projects',
        control: form.control,
        keyName: '_id'
    })

    useEffect(() => {
        form.reset({ projects: rows })
    }, [projects, form, rows])

    return {
        projects,
        form,
        fieldsArr
    }
}

/**
 * 
 * @param id ID of the project to delete
 * @param client supabase client
 * 
 */
export async function deleteProject(id: string, client: SupabaseClient<Database>) {
    const { error } = await client.from('projects').delete().eq('id', id)
    if (error) throw error;
}

/**
 * API call to fetch projects
 */
export async function fetchProjects({ userId, client }: { userId?: string, client: SupabaseClient<Database> }) {
    if (!userId) throw new Error('User not provided');
    const projects = await client.from('projects').select('*').filter('resume_id', 'is', null).eq('user_id', userId)
    return projects.data
}

/**
 * 
 * @returns default experience object
 */
export function getDefaultProject({ userId, resume_id }: { userId?: string, resume_id?: string }) {
    const experience = {
        id: uuid(),
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        user_id: userId,
        skills: [],
        resume_id
    } as unknown as Project

    return experience
}