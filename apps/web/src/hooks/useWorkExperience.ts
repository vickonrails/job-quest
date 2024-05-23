import { invalidateCacheAction } from '@/actions';
import { setEntityId } from '@/utils/set-entity-id';
import { createClient } from '@/utils/supabase/client';
import { type SupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type Highlight, type WorkExperience } from 'lib/types';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { type Database } from 'shared';
import { v4 as uuid } from 'uuid';
import { useSetupContext } from './useSetupContext';

export async function fetchWorkExperience({ userId, client }: { userId?: string, client: SupabaseClient<Database> }) {
    // TODO: error handling
    if (!userId) throw new Error('userId not provided');
    return (await client.from('work_experience').select('*, highlights ( * )').filter('resume_id', 'is', null).eq('user_id', userId)).data
}

export function useWorkExperience() {
    const client = createClient()
    const queryClient = useQueryClient()
    const { next, user } = useSetupContext()
    const queryResult = useQuery(['work_experience'], () => fetchWorkExperience({ userId: user?.id, client }))
    const form = useForm<{ workExperience: WorkExperience[] }>({
        defaultValues: { workExperience: queryResult.data?.length ? queryResult.data : [getDefaultExperience({ userId: user?.id })] }
    })
    const [highlightsToDelete, setHighlightsToDelete] = useState<string[]>([])

    const fieldsArr = useFieldArray({
        name: 'workExperience',
        control: form.control,
        keyName: '_id'
    })

    // TODO: I think I should do error handling inside of here.
    const updateExperiences = useMutation({
        mutationFn: async ({ values }: { values: WorkExperience[] }) => {
            if (!user?.id) return
            const highlights: Highlight[] = []

            try {
                const preparedValues = values.map(work => {
                    if (!work.id) {
                        work.id = uuid()
                    }

                    if (work.highlights) {
                        highlights.push(...work.highlights)
                        delete work.highlights
                    }

                    if ((work.still_working_here && work.end_date) || !work.end_date) {
                        work.end_date = null
                    }
                    return work
                })

                const { data, error } = await client.from('work_experience').upsert(preparedValues).select('*').returns<WorkExperience[]>();
                if (error) throw new Error(error.message)

                if (highlightsToDelete.length > 0) {
                    const result = await client.from('highlights').delete().in('id', highlightsToDelete);
                    if (result.error) throw new Error(result.error.message)
                }

                const preparedHighlights = highlights.filter(x => x.work_experience_id).map(highlight => setEntityId<Highlight>(highlight))
                const { error: highlightsError } = await client.from('highlights').upsert(preparedHighlights).select();
                if (highlightsError) throw new Error(highlightsError.message);

                const newWorkExperience = data.map(experience => {
                    experience.highlights = highlights.filter(x => x.work_experience_id === experience.id)
                    return experience;
                })
                return newWorkExperience
            } catch (error) {
                throw error
            }
        },
        onSuccess: (data) => {
            next();
            invalidateCacheAction(['workExperiences'])
            queryClient.setQueryData(['work_experience'], data);
            form.reset({ workExperience: data });
        }
    })

    useEffect(() => {
        form.reset({ workExperience: queryResult.data?.length ? queryResult.data : [getDefaultExperience({ userId: user?.id })] })
    }, [queryResult.data, form, user?.id])

    return {
        experiences: queryResult,
        form,
        fieldsArr,
        updateExperiences,
        setHighlightsToDelete
    }
}

/**
 * 
 * @param id ID of the experience to delete
 * @param client supabase client
 * 
 */
export async function deleteExperience(id: string, client: SupabaseClient<Database>) {
    const { error } = await client.from('work_experience').delete().eq('id', id)
    if (error) throw error;
}

/**
 * 
 * @returns default experience object
 */
export function getDefaultExperience({ userId }: { userId?: string }) {
    const id = uuid()
    const experience = {
        id,
        company_name: '',
        job_title: '',
        location: '',
        user_id: userId,
        highlights: [{ work_experience_id: id, user_id: userId, text: '', type: 'work_experience' }],
    } as unknown as WorkExperience

    return experience
}