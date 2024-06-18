'use client'

import { DeleteDialog } from '@/components/delete-dialog'
import { useToast } from '@/components/toast/use-toast'
import { updateProjects } from '@/db/actions/projects'
import { deleteProject, getDefaultProject, useProfileProjects } from '@/hooks/use-profile-projects'
import { createClient } from '@/utils/supabase/client'
import { type Project } from 'lib/types'
import { createRef, useEffect, useState } from 'react'
import { useDeleteModal } from 'src/hooks/useDeleteModal'
import { SectionFooter } from '../components/section-footer'
import { ProjectForm } from './project-form-item'

export type Projects = { projects: Project[] }

export default function ProfileProjects({ projects }: Projects) {
    const client = createClient()
    const { toast } = useToast()
    const [idxToRemove, setRemoveIdx] = useState<number>();
    const { form, fieldsArr } = useProfileProjects({ projects });
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
            const { success, error } = await updateProjects({ values: values.projects });
            if (!success || error) throw new Error(error)
            toast({
                title: 'Projects updated',
                variant: 'success'
            })
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
        remove(idxToRemove);
        await handleDelete();
    }

    return (
        <>
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
                    saveDisabled={fields.length <= 0 || !form.formState.isValid}
                    onAppendClick={() => append(getDefaultProject({ userId: '' }))}
                />
            </form>

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