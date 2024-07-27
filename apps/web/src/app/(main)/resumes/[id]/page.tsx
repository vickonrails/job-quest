'use client'

import ResumeFormBuilder from '@/components/resume-builder/resume-form-preview';
import { useResumeDetails } from '@/hooks/user-resume-details';
import { Suspense } from 'react';
import { FullPageSpinner } from 'ui/spinner';

export default function ResumeDetails({ params }: { params: { id: string } }) {
    const { isLoading, data } = useResumeDetails(params.id)
    if (isLoading) return <FullPageSpinner/>
    const { resume, workExperience, education, projects } = data
    if (!resume) return <p>An Error occurred</p>

    return (
        <Suspense fallback={<p>Loading...</p>}>
            <main className="overflow-auto">
                <ResumeFormBuilder
                    resume={resume}
                    workExperience={workExperience ?? []}
                    education={education ?? []}
                    projects={projects ?? []}
                />
            </main>
        </Suspense>
    )
}


