import { AlertDialog } from '@components/alert-dialog'
import { Spinner } from '@components/spinner'
import { useToast } from '@components/toast/use-toast'
import { type Database } from '@lib/database.types'
import { type Project } from '@lib/types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useQueryClient } from '@tanstack/react-query'
import { createRef, useEffect, useState } from 'react'
import { type UseFieldArrayAppend } from 'react-hook-form'
import { useDeleteModal } from 'src/hooks/useDeleteModal'
import { deleteProject, getDefaultProject, useProjects } from 'src/hooks/useProjects'
import { Button } from 'ui'
import { StepContainer } from './container'
import { ProjectFields } from './projects/project-fields'

export type Projects = { projects: Project[] }
export default function ProjectsView() {
    const client = useSupabaseClient<Database>()
    const queryClient = useQueryClient()
    const { toast } = useToast()
    const [idxToRemove, setRemoveIdx] = useState<number>();
    const { projects, form, fieldsArr, updateProjects } = useProjects();
    const { append, fields, remove } = fieldsArr
    const { formState } = form
    const {
        showDeleteDialog,
        onCancel,
        handleDelete,
        loading,
        setIsOpen,
        isOpen
    } = useDeleteModal({
        onDelete: async (id: string) => { await deleteProject(id, client) }
    });

    const formRef = createRef<HTMLFormElement>()

    const handleDeleteClick = (project: Project, index: number) => {
        if (!project.id) {
            remove(index);
            return;
        }
        setRemoveIdx(index);
        if (!project.id) return
        showDeleteDialog({ ...project, id: project.id });
    }

    const onSubmit = async (values: { projects: Project[] }) => {
        try {
            await updateProjects.mutateAsync({ values: values.projects });
        } catch (error) {
            toast({
                title: 'An error occured',
                variant: 'destructive'
            })
        }
    }

    // Prevent form submission on enter
    useEffect(() => {
        const form = formRef.current;
        const handler = (ev: KeyboardEvent) => {
            if (ev.target instanceof HTMLTextAreaElement) return;
            if (ev.key === 'Enter') {
                ev.preventDefault();
                return;
            }
        }

        form?.addEventListener('keypress', handler);
        return () => {
            form?.removeEventListener('keypress', handler)
        }
    }, [formRef])

    const onDeleteOk = async () => {
        await handleDelete();
        remove(idxToRemove);
        await queryClient.refetchQueries(['work_experience']);
    }

    if (projects.isLoading) return (
        <div className="inline-grid place-items-center mt-12 w-full">
            <Spinner />
        </div>
    )

    return (
        <>
            <StepContainer title="Projects">
                <p className="mb-4 text-gray-500">Showcase specific projects you've worked on that demonstrate your expertise and contributions. Include outcomes, technologies used, and your role in these projects.</p>
                <form onSubmit={form.handleSubmit(onSubmit)} ref={formRef}>
                    {fields.map((field, index) => (
                        <ProjectFields
                            key={field._id}
                            index={index}
                            field={field}
                            form={form}
                            onDeleteClick={handleDeleteClick}
                        />
                    ))}
                    <FormFooter
                        append={append}
                        isSubmitting={formState.isSubmitting}
                        saveDisabled={fields.length <= 0}
                    />
                </form>
            </StepContainer>

            <AlertDialog
                open={isOpen}
                title="Delete Confirmation"
                description="Are you sure you want to remove this experience"
                onOk={onDeleteOk}
                onOpenChange={setIsOpen}
                onCancel={onCancel}
                isProcessing={loading}
            />
        </>
    )
}



// ---------------------- Form Footer ---------------------- // 

interface FormFooterProps {
    saveDisabled: boolean;
    isSubmitting: boolean;
    append: UseFieldArrayAppend<{ projects: Project[] }, 'projects'>
}

function FormFooter({ saveDisabled, isSubmitting, append }: FormFooterProps) {
    return (
        <div className="flex gap-2">
            <Button
                className="text-primary"
                type="button"
                variant="outline"
                onClick={() => append(getDefaultProject())}
            >
                Add Project
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={saveDisabled}>Save & Proceed</Button>
        </div>
    )
}