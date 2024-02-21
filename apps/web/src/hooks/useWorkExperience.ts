import { type Database } from '@lib/database.types';
import { type Highlight, type WorkExperience } from '@lib/types';
import { useSupabaseClient, type SupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { fetchWorkExperience } from 'src/pages/profile/setup';
import { v4 as uuid } from 'uuid';
import { useSetupContext } from './useSetupContext';

function setEntityId<T extends { id: string }>(entity: T): T {
    if (entity && !entity.id) entity.id = uuid();
    return entity
}

export function useWorkExperience() {
    const client = useSupabaseClient<Database>()
    const queryClient = useQueryClient()
    const { next, session } = useSetupContext()
    const queryResult = useQuery(['work_experience'], () => fetchWorkExperience({ userId: session?.user.id, client }));
    const form = useForm<{ workExperience: WorkExperience[] }>({
        defaultValues: { workExperience: queryResult.data?.length ? queryResult.data : [getDefaultExperience()] }
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
            if (!session) return

            // first delete the highlights marked for delete
            try {
                const result = await client.from('highlights').delete().in('id', highlightsToDelete);
                if (result.error) throw new Error(result.error.message)

                const highlights = values.map(work => work.highlights).flat().filter(x => x?.work_experience_id) as Highlight[]
                const preparedHighlights = highlights.map(highlight => setEntityId<Highlight>(highlight))

                const { error: highlightsError } = await client.from('highlights').upsert(preparedHighlights).select();
                if (highlightsError) throw new Error(highlightsError.message);

                const preparedValues = values.map(work => {
                    if (!work.id) {
                        work.id = uuid()
                    }

                    if (work.highlights) {
                        delete work.highlights
                    }

                    if ((work.still_working_here && work.end_date) || !work.end_date) {
                        work.end_date = null
                    }
                    return work
                })

                const { data, error } = await client.from('work_experience').upsert(preparedValues).select();
                if (error) throw new Error(error.message)
                return data
            } catch (error) {
                throw error
            }
        },
        onSuccess: (data) => {
            next();
            queryClient.setQueryData(['work_experience'], data);
            form.reset({ workExperience: data });
        }
    })

    useEffect(() => {
        form.reset({ workExperience: queryResult.data ?? [getDefaultExperience()] })
    }, [queryResult.data, form])

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
export function getDefaultExperience() {
    const experience = {
        company_name: '',
        job_title: '',
        location: '',
        highlights: [{}],
    } as unknown as WorkExperience

    return experience
}