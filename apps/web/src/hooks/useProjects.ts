import { type Database } from '@lib/database.types';
import { type Project } from '@lib/types';
import { useSupabaseClient, type SupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { useSetupContext } from './useSetupContext';

export function useProjects() {
    const client = useSupabaseClient<Database>()
    const queryClient = useQueryClient()
    const { next, session } = useSetupContext()
    const queryResult = useQuery(['projects'], () => fetchProjects({ userId: session?.user.id, client }));
    const form = useForm<{ projects: Project[] }>({
        defaultValues: { projects: queryResult.data?.length ? queryResult.data : [getDefaultProject()] }
    })

    const fieldsArr = useFieldArray({
        name: 'projects',
        control: form.control,
        keyName: '_id'
    })

    // TODO: I think I should do error handling inside of here.
    const updateProjects = useMutation({
        mutationFn: async ({ values }: { values: Project[] }) => {
            if (!session) return
            const preparedValues = values.map(project => {
                if (!project.user_id) {
                    project.user_id = session?.user.id
                    project.id = uuid()
                }

                if (!project.start_date) project.start_date = null;
                if (!project.end_date) project.end_date = null;
                return project
            })
            const { data, error } = await client.from('projects').upsert(preparedValues).eq('user_id', session.user.id).select('*');
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
        form.reset({ projects: queryResult.data?.length ? queryResult.data : [getDefaultProject()] })
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
    return (await client.from('projects').select('*').eq('user_id', userId).filter('resume_id', 'is', null)).data
}

/**
 * 
 * @returns default experience object
 */
export function getDefaultProject() {
    const experience = {
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        skills: [],
        highlights: '',
    } as unknown as Project

    return experience
}