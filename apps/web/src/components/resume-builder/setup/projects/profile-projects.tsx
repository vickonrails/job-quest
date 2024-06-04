'use client'

import { DeleteDialog } from '@/components/delete-dialog'
import { useToast } from '@/components/toast/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { createRef, useEffect, useState } from 'react'
import { useDeleteModal } from 'src/hooks/useDeleteModal'
import { deleteProject, getDefaultProject, useProjects } from 'src/hooks/useProjects'
import { Spinner } from 'ui/spinner'
import { StepContainer } from '../components/container'
import { SectionFooter } from '../components/section-footer'
import { ProjectForm } from './project-form-item'
import { type Project } from 'lib/types'
import { createClient } from '@/utils/supabase/client'
import { useSetupContext } from '@/hooks/useSetupContext'

export type Projects = { projects: Project[] }

export default function ProjectsView() {
    const queryClient = useQueryClient()
    const client = createClient()
    const { user } = useSetupContext()
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
        <div className="inline-grid place-items-center mt-12 w-full" data-testid="projects-spinner">
            <Spinner />
        </div>
    )

    return (
        <>
            <StepContainer
                data-testid="projects"
                title="Projects"
                description="Showcase specific projects you&apos;ve worked on that demonstrate your expertise and contributions. Include outcomes, technologies used, and your role in these projects."
            >
                <form onSubmit={form.handleSubmit(onSubmit)} ref={formRef}>
                    <ProjectForm
                        fields={fields}
                        form={form}
                        onDeleteClick={handleDeleteClick}
                        autofocus
                        defaultOpen
                    />
                    <SectionFooter
                        addText="Add Project"
                        isSubmitting={formState.isSubmitting}
                        saveDisabled={fields.length <= 0}
                        onAppendClick={() => append(getDefaultProject({ userId: user?.id }))}
                    />
                </form>
            </StepContainer>

            <DeleteDialog
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