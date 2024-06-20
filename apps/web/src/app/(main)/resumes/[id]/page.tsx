import { getEducation } from '@/api/education';
import { getProjects } from '@/api/projects';
import { getResume } from '@/api/resume';
import { getWorkExperience } from '@/api/work-experience';
import ResumeFormBuilder from '@/components/resume-builder/resume-form-preview';
import { Suspense } from 'react';

export default async function ResumeDetails({ params }: { params: { id: string } }) {
    const resumeId = params.id
    const resumePromise = getResume(resumeId)
    const workExperiencePromise = getWorkExperience({});
    const educationPromise = getEducation({ resumeId });
    const projectsPromise = getProjects({ resumeId });

    const [resume, workExperience, education, projects] = await Promise.all([
        resumePromise,
        workExperiencePromise,
        educationPromise,
        projectsPromise
    ])

    // TODO: fix API must return an empty array if no fields exists
    if (!resume || !workExperience || !education || !projects) return;

    return (
        <Suspense fallback={<p>Loading...</p>}>
            <main className="overflow-auto">
                <ResumeFormBuilder
                    resume={resume}
                    workExperience={workExperience}
                    education={education}
                    projects={projects}
                />
            </main>
        </Suspense>
    )
}
