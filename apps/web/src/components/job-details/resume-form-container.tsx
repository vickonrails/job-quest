
'use client'

import { useResumeDetails } from '@/hooks/user-resume-details'
import { FullPageSpinner } from 'ui'
import ResumeFormBuilder from '../resume-builder/resume-form-preview'
import { type User } from '@supabase/supabase-js'

export function ResumeFormContainer({ user, resumeId }: { user: User, resumeId: string }) {
    const { isLoading, data } = useResumeDetails(resumeId, user)
    if (isLoading) return <FullPageSpinner />
    const { resume, workExperience, education, projects } = data
    if (!resume) return <p>An Error occurred</p>

    return (
        <ResumeFormBuilder
            resume={resume}
            workExperience={workExperience ?? []}
            education={education ?? []}
            projects={projects ?? []}
        />
    )
}

