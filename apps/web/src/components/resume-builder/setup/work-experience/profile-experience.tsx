import { AlertDialog } from '@components/alert-dialog'
import { useToast } from '@components/toast/use-toast'
import { type Database } from 'shared'
import { type WorkExperience as IWorkExperience } from '@lib/types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useDeleteModal } from 'src/hooks/useDeleteModal'
import { deleteExperience, getDefaultExperience, useWorkExperience } from 'src/hooks/useWorkExperience'
import { Spinner } from 'ui'
import { StepContainer } from '../components/container'
import { SectionFooter } from '../components/section-footer'
import { WorkExperienceForm } from './work-experience-form-item'

export function WorkExperience() {
    const client = useSupabaseClient<Database>()
    const queryClient = useQueryClient()
    const { toast } = useToast()
    const [idxToRemove, setRemoveIdx] = useState<number>();
    const { experiences, form, fieldsArr, updateExperiences, setHighlightsToDelete } = useWorkExperience();
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
        <div className="inline-grid place-items-center mt-12 w-full" data-testid="work-experience-spinner">
            <Spinner />
        </div>
    )

    return (
        <>
            <StepContainer
                title="Work Experience"
                data-testid="work-experience"
                description="Detail your professional history, including past positions held, responsibilities, key achievements, and the skills you developed. Tailor this section to the job you&apos;re applying for.."
            >
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <WorkExperienceForm
                        form={form}
                        fields={fields}
                        onDeleteClick={handleDeleteClick}
                        onHighlightDelete={setHighlightsToDelete}
                        autofocus
                        defaultOpen
                    />
                    <SectionFooter
                        saveDisabled={fields.length <= 0 || !form.formState.isValid}
                        isSubmitting={form.formState.isSubmitting}
                        onAppendClick={() => append(getDefaultExperience())}
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