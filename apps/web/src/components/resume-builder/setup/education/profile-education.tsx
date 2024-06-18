'use client'

import { DeleteDialog } from '@/components/delete-dialog';
import { useToast } from '@/components/toast/use-toast';
import { useSetupContext } from '@/hooks/useSetupContext';
import { createClient } from '@/utils/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { type Education } from 'lib/types';
import { useState } from 'react';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { deleteEducation, getDefaultEducation, useEducation } from 'src/hooks/useEducation';
import { Spinner } from 'ui/spinner';
import { StepContainer } from '../components/container';
import { SectionFooter } from '../components/section-footer';
import { EducationForm } from './education-form-item';

export function EducationStep() {
    const client = createClient()
    const queryClient = useQueryClient()
    const { user } = useSetupContext()
    const { toast } = useToast()
    const [idxToRemove, setRemoveIdx] = useState<number>();
    const {
        form,
        education,
        fieldsArr,
        updateEducation
    } = useEducation();

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
        onDelete: async (id: string) => { await deleteEducation(id, client) }
    });

    const onSubmit = async (values: { education: Education[] }) => {
        try {
            await form.trigger('education')
            await updateEducation.mutateAsync({ values: values.education });
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
        await handleDelete();
        remove(idxToRemove);
        await queryClient.refetchQueries(['education']);
    }

    if (education.isLoading) return (
        <div className="inline-grid place-items-center mt-12 w-full" data-testid="education-spinner">
            <Spinner />
        </div>
    )

    return (
        <>
            <StepContainer
                data-testid="education"
                title="Education"
                description="List your academic background, including degrees earned, institutions attended, and any honors or awards received. Relevant coursework can also be included here."
            >
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
                        onAppendClick={() => append(getDefaultEducation({ userId: user?.id }))}
                    />
                </form>
            </StepContainer>
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