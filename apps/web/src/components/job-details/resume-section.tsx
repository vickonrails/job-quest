import { MenuBar, MenuItem, Separator } from '@components/menubar';
import { ResumePreviewCard } from '@components/resume-card';
import { type Database } from '@lib/database.types';
import { type Job } from '@lib/types';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from '@utils/cn';
import { ChevronDown } from 'react-feather';
import { useRouter } from 'next/router';
import { Button, Spinner } from 'ui';
import { v4 as uuid } from 'uuid';

export function ResumeSection({ job }: { job: Job }) {
    const queryClient = useQueryClient();
    const client = useSupabaseClient<Database>()
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

            <div className="flex gap-2">
                <MenuBar
                    trigger={
                        <Button variant="outline" className={cn('flex items-center gap-1', updateResumeMutation.isLoading && 'opacity-80 pointer-events-none')}>
                            <span>{job.resume_id ? 'Replace Resume' : 'Add Resume'}</span>
                            <ChevronDown size={16} />
                        </Button>
                    }
                >
                    {data?.map(x => (
                        <MenuItem className="text-muted-foreground py-2" key={x.title} onClick={() => attachResume(x.id)}>{x.title}</MenuItem>
                    ))}
                    <Separator />
                    <MenuItem className="text-primary py-2" onClick={navigateToNew}>
                        Create From Blank
                    </MenuItem>
                </MenuBar>
                {updateResumeMutation.isLoading && <Spinner />}
            </div>
        </section>
    )
}