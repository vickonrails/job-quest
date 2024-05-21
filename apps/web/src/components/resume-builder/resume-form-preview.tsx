'use client'

import { type Education, type Project, type Resume, type WorkExperience } from 'lib/types'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import BackButton from '../back-button'
import { Preview } from './builder/preview'
import { Skills } from './builder/sections'
import { BasicInfoSection } from './builder/sections/resume-basic-info'
import { EducationSection } from './builder/sections/resume-education'
import { WorkExperienceSection } from './builder/sections/resume-experience'
import { ProjectsSection } from './builder/sections/resume-projects'

// TODO: reduce all these to one component
function filteredResumeExperience(resumeId: string, workExperience: WorkExperience[]) {
    return workExperience.filter(x => x.resume_id === resumeId)
}

function filteredEducation(resumeId: string, education: Education[]) {
    return education.filter(x => x.resume_id === resumeId)
}

function filteredProjects(resumeId: string, education: Project[]) {
    return education.filter(x => x.resume_id === resumeId)
}

interface ResumeFormBuilderProps {
    resume: Resume
    workExperience: WorkExperience[]
    education: Education[]
    projects: Project[]
}

export default function ResumeFormBuilder({ resume, workExperience, education, projects }: ResumeFormBuilderProps) {
    const router = useRouter();
    const basicInfoForm = useForm<{ resume: Resume }>({ defaultValues: { resume } });
    const workExperienceForm = useForm<{ workExperience: WorkExperience[] }>({ defaultValues: { workExperience: filteredResumeExperience(resume?.id, workExperience) } });
    const educationForm = useForm<{ education: Education[] }>({ defaultValues: { education: filteredEducation(resume.id, education) } });
    const projectsForm = useForm<{ projects: Project[] }>({ defaultValues: { projects: filteredProjects(resume.id, projects) } });

    // TODO: memoize
    const workExperienceTemplates = workExperience.filter(x => !x.resume_id)
    const educationTemplates = education.filter(x => !x.resume_id)
    const projectsTemplates = projects.filter(x => !x.resume_id)

    return (
        <div className="flex w-full h-full">
            <section className="w-1/2 border-r p-6 flex-shrink-0 mx-auto overflow-auto relative">
                <section className="max-w-xl mx-auto">
                    <div className="flex items-center justify-between gap-4">
                        <BackButton onClick={() => router.back()} />
                    </div>
                    <BasicInfoSection form={basicInfoForm} />
                    <WorkExperienceSection
                        userId={resume.user_id}
                        templates={workExperienceTemplates}
                        form={workExperienceForm}
                    />
                    <EducationSection
                        userId={resume.id}
                        form={educationForm}
                        templates={educationTemplates}
                    />
                    <ProjectsSection
                        userId={resume.id}
                        form={projectsForm}
                        templates={projectsTemplates}
                    />
                    <Skills form={basicInfoForm} />
                </section>
            </section>
            <Preview
                educationForm={educationForm}
                resumeForm={basicInfoForm}
                workExperienceForm={workExperienceForm}
                projectsForm={projectsForm}
            />
        </div>
    )
}
