'use client'

import { DeleteDialog } from '@/components/delete-dialog';
import { useToast } from '@/components/toast/use-toast';
import { deleteEducation } from '@/db/api/actions/education.action';
import { updateEducation } from '@/db/api/actions/resume.action';
import { getDefaultEducation, useProfileEducation } from '@/hooks/use-profile-education';
import { type Education } from 'lib/types';
import { useState } from 'react';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { SectionFooter } from '../components/section-footer';
import { EducationForm } from './education-form-item';

export function ProfileEducation({ education }: { education: Education[] }) {
    const { toast } = useToast()
    const [idxToRemove, setRemoveIdx] = useState<number>();
    const { form, fieldsArr } = useProfileEducation({ education });

    const { formState } = form
    const { fields, remove, append } = fieldsArr

    const {
        showDeleteDialog,
        onCancel,
        handleDelete,
        loading,
        setIsOpen,
        isOpen
    } = useDeleteModal({
        onDelete: async (id: string) => {
            await deleteEducation(id)
        }
    });

    const onSubmit = async (values: { education: Education[] }) => {
        try {
            const { error } = await updateEducation(values.education)
            if (error) throw error
            toast({
                title: 'Education updated',
                variant: 'success'
            })
        } catch (error) {
            toast({
                title: 'An error occured',
                variant: 'destructive'
            })
        }
    }

    const handleDeleteClick = (education: Education, index: number) => {
        if (!education.id) {
            remove(index);
            return;
        }
        setRemoveIdx(index);
        if (!education.id) return
        showDeleteDialog({ ...education, id: education.id });
    }

    const onDeleteOk = async () => {
        remove(idxToRemove);
        await handleDelete();
    }

    return (
        <>

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <EducationForm
                    form={form}
                    fields={fields}
                    onDeleteClick={handleDeleteClick}
                    autofocus
                    defaultOpen
                />
                <SectionFooter
                    addText="Add Education"
                    saveDisabled={fields.length === 0 || !form.formState.isValid}
                    isSubmitting={formState.isSubmitting}
                    onAppendClick={() => append(getDefaultEducation({ userId: '' }))}
                />
            </form>

            <DeleteDialog
                open={isOpen}
                title="Delete Confirmation"
                description="Are you sure you want to remove this education"
                onOk={onDeleteOk}
                onOpenChange={setIsOpen}
                onCancel={onCancel}
                isProcessing={loading}
            />
        </>
    )
}