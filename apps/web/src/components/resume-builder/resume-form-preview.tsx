'use client'

import { deleteResume } from '@/actions/resume'
import { useDeleteModal } from '@/hooks/useDeleteModal'
import { createClient } from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { type Education, type Project, type Resume, type WorkExperience } from 'lib/types'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from 'ui/button'
import { Spinner } from 'ui/spinner'
import { DeleteDialog } from '../delete-dialog'
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
    const { showDeleteDialog, isOpen, handleDelete, setIsOpen, onCancel } = useDeleteModal({
        onDelete: async (id) => {
            try {
                const { success, error } = await deleteResume(id)
                if (!success || error) throw error
                router.push('/resumes')
            } catch (error) {
                throw error
            }
        }
    })

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
                        userId={resume.user_id}
                        form={educationForm}
                        templates={educationTemplates}
                    />
                    <ProjectsSection
                        userId={resume.user_id}
                        form={projectsForm}
                        templates={projectsTemplates}
                    />
                    <Skills form={basicInfoForm} />
                    <Button variant="destructive" onClick={() => showDeleteDialog(resume)}>Delete Resume</Button>
                </section>
            </section>
            <Preview
                educationForm={educationForm}
                resumeForm={basicInfoForm}
                workExperienceForm={workExperienceForm}
                projectsForm={projectsForm}
            />
            <DeleteDialog
                open={isOpen}
                title="Delete Confirmation"
                description={<DeleteDescription resumeId={resume.id} />}
                onOk={handleDelete}
                onOpenChange={setIsOpen}
                onCancel={onCancel}
            // isProcessing={loading}
            />
        </div>
    )
}


function DeleteDescription({ resumeId }: { resumeId: string }) {
    const client = createClient();
    const { data, isLoading } = useQuery({
        queryFn: async () => {
            const { data, error } = await client.from('jobs').select().eq('resume_id', resumeId)
            if (error) throw error;
            return data;
        },
        queryKey: ['jobs', resumeId]
    })
    const usedInJobs = data && data?.length > 0;

    if (isLoading) return (
        <div className="flex mt-4">
            <Spinner className="h-6 w-6 m-auto" />
        </div>
    )

    return (
        <section className="flex flex-col gap-2">
            <p>{usedInJobs && 'This resume is used in the following Job applications. '} Are you sure you want to delete this Resume? </p>
            <ul className="list-disc pl-4">
                {data?.map(job => (
                    <li key={job.id}><span className="font-medium">{job.position}</span> at {job.company_name}</li>
                ))}
            </ul>
        </section>
    )
}