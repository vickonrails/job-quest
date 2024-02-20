import { type Database } from '@lib/database.types';
import { Highlight, type WorkExperience } from '@lib/types';
import { useSupabaseClient, type SupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { fetchWorkExperience } from 'src/pages/profile/setup';
import { v4 as uuid } from 'uuid';
import { useSetupContext } from './useSetupContext';

export function useWorkExperience() {
    const client = useSupabaseClient<Database>()
    const queryClient = useQueryClient()
    const { next, session } = useSetupContext()
    const queryResult = useQuery(['work_experience'], () => fetchWorkExperience({ userId: session?.user.id, client }));
    const form = useForm<{ workExperience: WorkExperience[] }>({
        defaultValues: { workExperience: queryResult.data?.length ? queryResult.data : [getDefaultExperience()] }
    })

    const fieldsArr = useFieldArray({
        name: 'workExperience',
        control: form.control,
        keyName: '_id'
    })

    // TODO: I think I should do error handling inside of here.
    const updateExperiences = useMutation({
        mutationFn: async ({ values }: { values: WorkExperience[] }) => {
            if (!session) return
            const highlights = values.map(work => work.highlights).flat().filter(highlight => highlight !== undefined).map(x => {
                if (x && !x.id) x.id = uuid();
                return x
            }) as Highlight[]

            // assign the highlights to the work experience
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


            const { data: _data, error: _error } = await client.from('highlights').upsert(highlights).select();
            if (_error) throw _error;

            const { data, error } = await client.from('work_experience').upsert(preparedValues).select();
            if (error) throw error;

            return data;
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
        updateExperiences
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