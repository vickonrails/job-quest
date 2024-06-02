'use client'

import { ResumePreviewCard } from '@/components/resume-card';
import { createClient } from '@/utils/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type Job } from 'lib/types';
import { useRouter } from 'next/navigation';
import { v4 as uuid } from 'uuid';
import { ResumeSelectDropdown } from './resume-select-dropdown';

export function ResumeSection({ job }: { job: Job }) {
    const queryClient = useQueryClient();
    const client = createClient()
    const router = useRouter()
    const navigateToNew = () => {
        return router.push(`/resumes/${uuid()}`)
    }

    const { data } = useQuery({
        queryKey: ['resume-templates'],
        queryFn: async () => {
            const { data, error } = await client.from('resumes').select()
            if (error) throw error
            return data
        }
    })

    const updateResumeMutation = useMutation({
        mutationFn: async (job: Job) => {
            const { error } = await client.from('jobs').update(job).eq('id', job.id)
            if (error) throw error
        },
        onSuccess: async (data, variables) => {
            job.resume_id = variables.resume_id;
            await queryClient.invalidateQueries({ queryKey: ['resume-templates'] })
        },
    })

    const attachResume = async (resumeId?: string) => {
        if (!resumeId) return
        try {
            await updateResumeMutation.mutateAsync({ ...job, resume_id: resumeId })
        } catch {
            // throw error
        }
    }

    const resume = data?.find(resume => resume.id === job.resume_id)

    return (
        <section className="border-b pb-6">
            <div className="mb-3 flex flex-col gap-3">
                <header>
                    <h3 className="font-medium">Add Resume</h3>
                    <p className="text-sm text-muted-foreground">Pick an already created resume or create a new one.</p>
                </header>

                {resume && (
                    <ResumePreviewCard
                        resume={resume}
                        className="w-full"
                    />
                )}
            </div>

            <ResumeSelectDropdown
                onClickNew={navigateToNew}
                isUpdating={updateResumeMutation.isLoading}
                attachResume={attachResume}
                resumes={data ?? []}
            />
        </section>
    )
}