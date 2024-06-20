import { type WorkExperience } from 'lib/types';
import { useEffect, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';

export function useProfileWorkExperience({ workExperience }: { workExperience: WorkExperience[] }) {
    const rows = useMemo(() => {
        return workExperience.length > 0 ? workExperience : [getDefaultExperience({ userId: '' })]
    }, [workExperience])
    const form = useForm<{ workExperience: WorkExperience[] }>({ defaultValues: { workExperience: rows } })

    const fieldsArr = useFieldArray({
        name: 'workExperience',
        control: form.control,
        keyName: '_id'
    })

    useEffect(() => {
        form.reset({ workExperience: rows })
    }, [workExperience, form, rows])

    return {
        experiences: workExperience,
        form,
        fieldsArr
    }
}

/**
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
        highlights: '',
    } as unknown as WorkExperience

    return experience
}