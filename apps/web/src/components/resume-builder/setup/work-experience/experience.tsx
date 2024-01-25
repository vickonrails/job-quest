import { AlertDialog } from '@components/alert-dialog'
import { Spinner } from '@components/spinner'
import { useToast } from '@components/toast/use-toast'
import { type Database } from '@lib/database.types'
import { type WorkExperience as IWorkExperience } from '@lib/types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { type UseFieldArrayAppend } from 'react-hook-form'
import { useDeleteModal } from 'src/hooks/useDeleteModal'
import { deleteExperience, getDefaultExperience, useWorkExperience } from 'src/hooks/useWorkExperience'
import { Button } from 'ui'
import { StepContainer } from '../container'
import { WorkExperienceForm } from './single-form'

export function WorkExperience() {
    const client = useSupabaseClient<Database>()
    const queryClient = useQueryClient()
    const { toast } = useToast()
    const [idxToRemove, setRemoveIdx] = useState<number>();
    const { experiences, form, fieldsArr, updateExperiences } = useWorkExperience();
    const { append, fields, remove } = fieldsArr
    const {
        showDeleteDialog,
        onCancel,
        handleDelete,
        loading,
        setIsOpen,
        isOpen
    } = useDeleteModal({
        onDelete: async (id: string) => { await deleteExperience(id, client) }
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
            await updateExperiences.mutateAsync({ values: values.workExperience });
        } catch (error) {
            toast({
                title: 'An error occured',
                variant: 'destructive'
            })
        }
    }

    const onDeleteOk = async () => {
        await handleDelete();
        remove(idxToRemove);
        await queryClient.refetchQueries(['work_experience']);
    }

    // TODO: use skeleton loaders
    if (experiences.isLoading) return (
        <div className="inline-grid place-items-center mt-12 w-full">
            <Spinner />
        </div>
    )

    return (
        <>
            <StepContainer title="Work Experience">
                <p className="mb-4 text-gray-500">Work Experience.</p>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {fields.map((field, index) => (
                        <WorkExperienceForm
                            key={field._id}
                            index={index}
                            form={form}
                            field={field}
                            onDeleteClick={handleDeleteClick}
                        />
                    ))}
                    <FormFooter
                        saveDisabled={fields.length <= 0}
                        isSubmitting={form.formState.isSubmitting}
                        append={append}
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
    append: UseFieldArrayAppend<{ workExperience: IWorkExperience[] }>
}

function FormFooter({ saveDisabled, isSubmitting, append }: FormFooterProps) {
    return (
        <div className="flex gap-2">
            <Button
                className="text-primary"
                type="button"
                variant="outline"
                onClick={() => append(getDefaultExperience())}
            >
                Add Experience
            </Button>
            <Button loading={isSubmitting} disabled={saveDisabled}>Save & Proceed</Button>
        </div>
    )
}