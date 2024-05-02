import { createClient } from '@lib/supabase/component';
import { type Project } from '@lib/types';
import { type SupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { type Database } from 'shared';
import { v4 as uuid } from 'uuid';
import { useSetupContext } from './useSetupContext';
import { useUserContext } from 'src/pages/_app';

export function useProjects({ userId }: { userId?: string }) {
    const client = createClient()
    const queryClient = useQueryClient()
    const { next } = useSetupContext()
    const user = useUserContext()
    const queryResult = useQuery(['projects'], () => fetchProjects({ userId: userId, client }));
    const form = useForm<{ projects: Project[] }>({
        defaultValues: { projects: queryResult.data?.length ? queryResult.data : [getDefaultProject({ userId: user?.id })] }
    })

    const fieldsArr = useFieldArray({
        name: 'projects',
        control: form.control,
        keyName: '_id'
    })

    // TODO: I think I should do error handling inside of here.
    const updateProjects = useMutation({
        mutationFn: async ({ values }: { values: Project[] }) => {
            if (!userId) return
            const preparedValues = values.map(project => {
                if (!project.id) {
                    project.id = uuid()
                }

                if (!project.start_date) project.start_date = null;
                if (!project.end_date) project.end_date = null;
                return project
            })
            const { data, error } = await client.from('projects').upsert(preparedValues).select('*');
            if (error) throw error;

            return data;
        },
        onSuccess: (data) => {
            next();
            queryClient.setQueryData(['projects'], data);
            form.reset({ projects: data });
        }
    })

    useEffect(() => {
        form.reset({ projects: queryResult.data?.length ? queryResult.data : [getDefaultProject({ userId: user?.id })] })
    }, [queryResult.data, form])

    return {
        projects: queryResult,
        form,
        fieldsArr,
        updateProjects
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
    if (!userId) return;
    const projects = await client.from('projects').select('*').filter('resume_id', 'is', null).eq('user_id', userId)
    return projects.data
}

/**
 * 
 * @returns default experience object
 */
export function getDefaultProject({ userId }: { userId?: string }) {
    const experience = {
        id: uuid(),
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        user_id: userId,
        skills: []
    } as unknown as Project

    return experience
}