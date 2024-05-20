import { AlertDialog } from '@/components/alert-dialog';
import BackButton from '@/components/back-button';
import { Chip } from '@/components/chips';
import { useToast } from '@/components/toast/use-toast';
import { DevTool } from '@hookform/devtools';
import { type SupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createRef, forwardRef, memo, useEffect, useState } from 'react';
import { useFieldArray, useFormContext, type UseFormReturn } from 'react-hook-form';
import { type Database } from 'shared';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { Button, Input, type ButtonProps } from 'ui';
import { Spinner } from 'ui/spinner';
import { type FormValues } from 'resume-templates';
import { BasicInfoSection } from './resume-basic-info';
import { EducationSection } from './resume-education';
import { WorkExperienceSection } from './resume-experience';
import { ProjectsSection } from './resume-projects';
import { createClient } from '@/utils/supabase/client';
import { type Resume } from 'lib/types';

export async function deleteResume(id: string, client: SupabaseClient<Database>) {
    try {
        const { error: educationError } = await client.from('education').delete().eq('resume_id', id);
        if (educationError) throw educationError;
        const { error: projectsError } = await client.from('projects').delete().eq('resume_id', id);
        if (projectsError) throw projectsError;
        const { error: experienceError } = await client.from('work_experience').delete().eq('resume_id', id);
        if (experienceError) throw experienceError;

        const { data, error: jobsError } = await client.from('jobs').select().eq('resume_id', id)
        if (jobsError) throw jobsError;

        const updatedJobs = data.map(job => {
            job.resume_id = null
            return job
        })
        const { error: updateError } = await client.from('jobs').upsert(updatedJobs)
        if (updateError) throw updateError;

        const { error } = await client.from('resumes').delete().eq('id', id)
        if (error) throw error;
    } catch {
        throw new Error('Failed to delete resume')
    }
}

// export const ResumeForm = memo(({ resume }: { resume: Resume }) => {
//     const form = useFormContext<FormValues>()
//     const router = useRouter()
//     const formRef = createRef<HTMLFormElement>()
//     const client = createClient();
//     const { toast } = useToast();
//     const {
//         showDeleteDialog,
//         onCancel,
//         handleDelete: deleteFn,
//         loading,
//         setIsOpen,
//         isOpen
//     } = useDeleteModal({
//         onDelete: async (id: string) => { await deleteResume(id, client) }
//     });

//     useEffect(() => {
//         const form = formRef.current;
//         const handler = (ev: KeyboardEvent) => {
//             if (ev.key === 'Enter') {
//                 ev.preventDefault();
//                 return;
//             }
//         }

//         form?.addEventListener('keypress', handler);
//         return () => {
//             form?.removeEventListener('keypress', handler)
//         }
//     }, [formRef])

//     const handleDelete = async () => {
//         try {
//             await deleteFn();
//             return router.push('/resumes')
//         } catch (error) {
//             toast({
//                 variant: 'destructive',
//                 title: 'An error occurred'
//             })
//         }
//     }

//     return (
//         <>
//             <WorkExperienceSection />
//             <ProjectsSection />
//             <EducationSection />
//             <Skills />
//             <Button type="button" variant="destructive" className="flex items-center gap-1" onClick={() => showDeleteDialog(resume)}>
//                 <Trash2 size={18} />
//                 <span>Delete</span>
//             </Button>
//             {/* <DevTool control={form.control} /> */}


//             <AlertDialog
//                 open={isOpen}
//                 title="Delete Confirmation"
//                 description={<DeleteDescription resumeId={resume.id} />}
//                 onOk={handleDelete}
//                 onOpenChange={setIsOpen}
//                 onCancel={onCancel}
//                 isProcessing={loading}
//             />
//         </>
//     )
// })

// ResumeForm.displayName = 'ResumeForm'

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

export function Skills({ form }: { form: UseFormReturn<{ resume: Resume }> }) {
    // const form = useFormContext<FormValues>();
    return (
        <section className="mb-4">
            <h3 className="font-medium text-lg">Skills</h3>
            <p className="mb-4 text-sm text-muted-foreground">List relevant skills that match this job description.</p>
            <SkillsForm form={form} />
        </section>
    )
}

// TODO: refactor to use SkillsForm from profile setup
export function SkillsForm({ form }: { form: UseFormReturn<{ resume: Resume }> }) {
    const [skillValue, setSkillValue] = useState<string>('')
    const inputRef = createRef<HTMLInputElement>()

    const { append, fields, remove } = useFieldArray({
        name: 'resume.skills',
        control: form.control,
        keyName: '_id'
    });

    useEffect(() => {
        const input = inputRef.current;
        const handler = (ev: KeyboardEvent) => {
            if (!skillValue) return
            if (ev.key === 'Enter') {
                append({ label: skillValue })
                setSkillValue('')
            }
        }
        input?.addEventListener('keypress', handler);
        return () => {
            input?.removeEventListener('keypress', handler);
        }
    }, [append, inputRef, skillValue])

    return (
        <section className="mb-4 rounded-md">
            <Input
                label="Relevant Skills (Press Enter to add)"
                className="mb-4"
                value={skillValue}
                onChange={ev => setSkillValue(ev.target.value)}
                placeholder="Press Enter to add skill"
                ref={inputRef}
            />
            {fields.map((field, idx) => (
                <Chip key={field._id} label={field.label ?? ''} onCloseClick={() => remove(idx)} />
            ))}
        </section>
    )
}


/**
 * Button to add new sections
 */
export const AddSectionBtn = forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...props }, ref) => {
    return (
        <Button type="button" variant="ghost" {...props} ref={ref}>
            <span className="text-sm text-primary hover:text-primary">{children}</span>
            <ChevronDown size={16} />
        </Button>
    )
})
AddSectionBtn.displayName = 'AddSectionBtn'