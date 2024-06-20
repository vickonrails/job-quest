'use client'

import { DeleteDialog } from '@/components/delete-dialog'
import { useToast } from '@/components/toast/use-toast'
import { deleteWorkExperience, updateWorkExperience } from '@/db/api/actions/experience.action'
import { getDefaultExperience, useProfileWorkExperience } from '@/hooks/use-work-experience'
import { type WorkExperience as IWorkExperience, type WorkExperience } from 'lib/types'
import { useState } from 'react'
import { useDeleteModal } from 'src/hooks/useDeleteModal'
import { SectionFooter } from '../components/section-footer'
import { WorkExperienceForm } from './work-experience-form-item'

export function ProfileWorkExperience({ workExperience }: { workExperience: WorkExperience[] }) {
    const { toast } = useToast()
    const [idxToRemove, setRemoveIdx] = useState<number>()
    const { form, fieldsArr } = useProfileWorkExperience({ workExperience })
    const { append, fields, remove } = fieldsArr
    const {
        showDeleteDialog,
        onCancel,
        handleDelete,
        loading,
        setIsOpen,
        isOpen
    } = useDeleteModal({
        onDelete: async (id: string) => {
            await deleteWorkExperience(id)
        }
    });

    const handleDeleteClick = (experience: IWorkExperience, index: number) => {
        if (!experience.id) {
            remove(index);
            return;
        }
        setRemoveIdx(index);
        if (!experience.id) return
        showDeleteDialog({ ...experience, id: experience.id });
    }

    const onSubmit = async (values: { workExperience: IWorkExperience[] }) => {
        try {
            const response = await updateWorkExperience({ values: values.workExperience })
            if (response.success) {
                toast({
                    title: 'Work Experience updated',
                    variant: 'success'
                })
            }
        } catch (error) {
            toast({
                title: 'An error occured',
                variant: 'destructive'
            })
        }
    }

    const onDeleteOk = async () => {
        remove(idxToRemove);
        await handleDelete();
    }

    return (
        <>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <WorkExperienceForm
                    form={form}
                    fields={fields}
                    onDeleteClick={handleDeleteClick}
                    autofocus
                    defaultOpen
                />
                <SectionFooter
                    addText="Add Education"
                    saveDisabled={fields.length <= 0 || !form.formState.isValid}
                    isSubmitting={form.formState.isSubmitting}
                    onAppendClick={() => append(getDefaultExperience({ userId: '' }))}
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