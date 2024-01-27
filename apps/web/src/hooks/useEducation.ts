import { type Database } from '@lib/database.types';
import { type Education } from '@lib/types';
import { useSession, useSupabaseClient, type SupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { useSetupContext } from './useSetupContext';

export function useEducation() {
    const client = useSupabaseClient<Database>()
    const queryClient = useQueryClient()
    const { next } = useSetupContext()
    const session = useSession();
    const queryResult = useQuery(['education'], () => fetchEducation({ userId: session?.user.id, client }));
    const form = useForm<{ education: Education[] }>({
        defaultValues: { education: queryResult.data?.length ? queryResult.data : [getDefaultEducation()] }
    })

    const fieldsArr = useFieldArray({
        name: 'education',
        control: form.control,
        keyName: '_id'
    })

    // TODO: I think I should do error handling inside of here.
    const updateEducation = useMutation({
        mutationFn: async ({ values }: { values: Education[] }) => {
            if (!session) return
            const preparedValues = values.map(education => {
                if (!education.user_id) {
                    education.user_id = session?.user.id
                    education.id = uuid()
                }
                if ((education.still_studying_here && education.end_date) || !education.end_date) {
                    education.end_date = null
                }
                return education
            })
            const { data, error } = await client.from('education').upsert(preparedValues).eq('user_id', session.user.id).select('*');
            if (error) throw error;

            return data;
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
        updateEducation
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
    const education = {
        degree: '',
        field_of_study: '',
        institution: '',
        user_id: '',
        location: '',
        end_date: '',
        start_date: ''
    } as unknown as Education;

    return education
}

export async function fetchEducation({ userId, client }: { userId?: string, client: SupabaseClient<Database> }) {
    if (!userId) return;
    // TODO: error handling
    return (await client.from('education').select('*').eq('user_id', userId)).data;
}