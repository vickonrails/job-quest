'use client'

import { type Resume } from 'lib/types'
import { FormProvider, useForm } from 'react-hook-form'
import { type FormValues } from 'resume-templates'
import { Preview } from './builder/preview'
import { ResumeForm } from './builder/sections'

export default function ResumeFormPreview({ resume }: { resume: Resume }) {
    const form = useForm<FormValues>({ defaultValues: { resume } });
    const { formState: { isSubmitting } } = form

    return (
        <div className="flex w-full h-full">
            <FormProvider {...form}>
                <ResumeForm resume={resume} />
                <Preview />
            </FormProvider>
        </div>
    )
}
