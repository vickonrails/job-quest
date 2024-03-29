import { type Database } from '@lib/database.types';
import { type Highlight, type Education } from '@lib/types';
import { useSession, useSupabaseClient, type SupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { useSetupContext } from './useSetupContext';
import { setEntityId } from '@utils/set-entity-id';

export function useEducation() {
    const client = useSupabaseClient<Database>()
    const queryClient = useQueryClient()
    const { next } = useSetupContext()
    const session = useSession();
    const queryResult = useQuery(['education'], () => fetchEducation({ userId: session?.user.id, client }));
    const form = useForm<{ education: Education[] }>({
        defaultValues: { education: queryResult.data?.length ? queryResult.data : [getDefaultEducation()] },
        shouldUnregister: false
    })

    const [highlightsToDelete, setHighlightsToDelete] = useState<string[]>([])

    const fieldsArr = useFieldArray({
        name: 'education',
        control: form.control,
        keyName: '_id'
    })

    // TODO: I think I should do error handling inside of here.
    const updateEducation = useMutation({
        mutationFn: async ({ values }: { values: Education[] }) => {
            if (!session) return
            const highlights: Highlight[] = []

            try {
                const preparedValues = values.map(education => {
                    if (!education.id) {
                        education.id = uuid()
                    }

                    if (education.highlights) {
                        highlights.push(...education.highlights)
                        delete education.highlights
                    }

                    if ((education.still_studying_here && education.end_date) || !education.end_date) {
                        education.end_date = null
                    }
                    return education
                })
                const { data, error } = await client.from('education').upsert(preparedValues).select('*');
                if (error) throw error;

                if (highlightsToDelete.length > 0) {
                    const result = await client.from('highlights').delete().in('id', highlightsToDelete);
                    if (result.error) throw new Error(result.error.message)
                }

                const preparedHighlights = highlights.filter(x => x.education_id).map(highlight => setEntityId<Highlight>(highlight))

                const { error: highlightsError } = await client.from('highlights').upsert(preparedHighlights).select();
                if (highlightsError) throw new Error(highlightsError.message);

                return data;
            } catch (error) {
                throw error
            }
        },
        onSuccess: (data) => {
            next();
            queryClient.setQueryData(['education'], data);
            // TODO: confirm if I truly need to reset the form here.
            form.reset({ education: data });
        }
    })

    useEffect(() => {
        form.reset({ education: queryResult.data?.length ? queryResult.data : [getDefaultEducation()] })
    }, [queryResult.data, form])

    return {
        education: queryResult,
        form,
        fieldsArr,
        updateEducation,
        setHighlightsToDelete
    }
}

/**
 * 
 * @param id ID of the experience to delete
 * @param client supabase client
 * 
 */
export async function deleteEducation(id: string, client: SupabaseClient<Database>) {
    const { error } = await client.from('education').delete().eq('id', id)
    if (error) throw error;
}

/**
 * 
 * @returns default education object
 */
export function getDefaultEducation() {
    const id = uuid()
    const education = {
        id,
        degree: '',
        field_of_study: '',
        institution: '',
        location: '',
        end_date: '',
        start_date: '',
        highlights: [{ education_id: id, type: 'education', text: '' }],
    } as unknown as Education;

    return education
}

export async function fetchEducation({ userId, client }: { userId?: string, client: SupabaseClient<Database> }) {
    if (!userId) return;
    // TODO: error handling
    return (await client.from('education').select('*, highlights ( * )').filter('resume_id', 'is', null)).data;
}