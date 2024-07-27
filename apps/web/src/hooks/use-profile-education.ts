'use client'

import { type SupabaseClient } from '@supabase/auth-helpers-react';
import { type Education } from 'lib/types';
import { useEffect, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { type Database } from 'shared';
import { v4 as uuid } from 'uuid';

export function useProfileEducation({ education }: { education: Education[] }) {
    const rows = useMemo(() => {
        return education.length > 0 ? education : [getDefaultEducation({ userId: '' })]
    }, [education])

    const form = useForm<{ education: Education[] }>({
        defaultValues: { education: rows },
        shouldUnregister: false
    })

    const fieldsArr = useFieldArray({
        name: 'education',
        control: form.control,
        keyName: '_id'
    })

    useEffect(() => {
        form.reset({ education: rows })
    }, [education, form, rows])

    return {
        form,
        fieldsArr
    }
}

/**
 * 
 * @param id ID of the experience to delete
 * @param client supabase client
 * 
//
// export async function deleteEducation(id: string, client: SupabaseClient<Database>) {
//     const { error } = await client.from('education').delete().eq('id', id)
//     if (error) throw error;
// }

/**
 * 
 * @returns default education object
 */
export function getDefaultEducation({ userId, resume_id }: { userId?: string, resume_id?: string }) {
    const id = uuid()
    const education = {
        id,
        degree: '',
        field_of_study: '',
        institution: '',
        location: '',
        end_date: '',
        start_date: '',
        user_id: userId,
        resume_id,
        highlights: [{ education_id: id, user_id: userId, type: 'education', text: '' }],
    } as unknown as Education;

    return education
}