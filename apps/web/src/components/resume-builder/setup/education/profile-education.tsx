import { AlertDialog } from '@components/alert-dialog';
import { useToast } from '@components/toast/use-toast';
import { type Database } from '@lib/database.types';
import { type Education } from '@lib/types';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { type UseFieldArrayAppend } from 'react-hook-form';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { deleteEducation, getDefaultEducation, useEducation } from 'src/hooks/useEducation';
import { Button, Spinner } from 'ui';
import { StepContainer } from '../components/container';
import { EducationForm } from './education-form-item';

export function EducationStep() {
    const client = useSupabaseClient<Database>()
    const queryClient = useQueryClient()
    const { toast } = useToast()
    const [idxToRemove, setRemoveIdx] = useState<number>();
    const { form, education, fieldsArr, updateEducation } = useEducation();
    const { formState } = form
    const { fields, remove } = fieldsArr
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
                    {fields.map((field, index) => (
                        <EducationForm
                            key={field._id}
                            form={form}
                            index={index}
                            field={field}
                            onDeleteClick={handleDeleteClick}
                        />
                    ))}
                    <FormFooter
                        append={fieldsArr.append}
                        saveDisabled={fields.length === 0}
                        isSubmitting={formState.isSubmitting}
                    />
                </form>
            </StepContainer>
            <AlertDialog
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

// ---------------------- Form Footer ---------------------- // 
interface FormFooterProps {
    saveDisabled: boolean;
    isSubmitting: boolean;
    append: UseFieldArrayAppend<{ education: Education[] }>
}

function FormFooter({ saveDisabled, isSubmitting, append }: FormFooterProps) {
    return (
        <div className="flex gap-2">
            <Button
                className="text-primary"
                type="button"
                variant="outline"
                onClick={() => append(getDefaultEducation())}
            >
                Add Education
            </Button>
            <Button loading={isSubmitting} disabled={saveDisabled}>Save & Proceed</Button>
        </div>
    )
}