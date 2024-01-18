import { AlertDialog } from '@components/alert-dialog'
import { type Database } from '@lib/database.types'
import { type WorkExperienceInsertDTO } from '@lib/types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useDeleteModal } from 'src/hooks/useDeleteModal'
import { useSetupContext } from 'src/hooks/useSetupContext'
import { defaultWorkExperience, type FormFields } from 'src/pages/profile/setup'
import { Button, Input } from 'ui'
import { StepContainer } from '../container'
// import { Highlights, type RefTypeWorkExperience } from './highlights'

export function WorkExperience() {
    const client = useSupabaseClient<Database>()
    const { register, control, handleSubmit, formState: { isSubmitting } } = useFormContext<FormFields>()
    const { fields, append, remove } = useFieldArray({
        name: 'workExperience',
        control,
        keyName: '_id'
    })

    const [removeIdx, setRemoveIdx] = useState<number>();

    const { showDeleteDialog, onCancel, handleDelete, loading, setIsOpen, isOpen } = useDeleteModal({
        onDelete: async (id: string) => {
            const { error } = await client.from('work_experience').delete().eq('id', id)
            if (error) throw error;
        }
    })

    const { next, updateWorkExperience, session } = useSetupContext()
    // const highlightRef = useRef<RefTypeWorkExperience>(null)
    const onSubmit = async (values: FormFields) => {
        if (!session?.user.id) return;
        await updateWorkExperience.mutateAsync({ values, userId: session?.user.id })
        next();
    }

    // TODO: add a confirmation dialog before deleting the work experience
    // TODO: optimistic update and rollback if the request fails
    const onDeleteClick = (experience: WorkExperienceInsertDTO, index: number) => {
        if (!experience.created_at) {
            remove(index);
            return;
        }

        setRemoveIdx(index);

        if (!experience.id) return
        showDeleteDialog({ ...experience, id: experience.id });
    }

    const onDeleteOk = async () => {
        await handleDelete();
        remove(removeIdx)
    }

    return (
        <>
            <StepContainer title="Work Experience">
                <p className="mb-4 text-gray-500">Work Experience.</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {fields.map((field, index) => (
                        <section className="p-4 border mb-8" key={field.id}>
                            <section className="mb-4 grid grid-cols-2 gap-3 rounded-md" key={field._id}>
                                <Input label="Company Name" placeholder="Company name" {...register(`workExperience.${index}.company_name`)} />
                                <Input label="Title" placeholder="Job titled held..." {...register(`workExperience.${index}.job_title`)} />
                                <Input label="Location" placeholder="Location..." {...register(`workExperience.${index}.location`)} />
                                <Input type="date" label="Start Date" placeholder="Start Date..." {...register(`workExperience.${index}.start_date`)} />
                                <Input type="date" label="End Date" placeholder="End Date..." {...register(`workExperience.${index}.end_date`)} />

                                {/* <Highlights index={index} ref={highlightRef} /> */}
                            </section>
                            <div className="flex justify-end gap-2">
                                <Button size="sm" type="button" variant="outline" /**onClick={() => highlightRef.current?.append('')}**/>Add Highlight</Button>
                                <Button size="sm" className="text-red-400 flex items-center gap-1" type="button" variant="outline" onClick={() => onDeleteClick(field, index)}>
                                    <Trash2 size={18} />
                                    <span>Remove Block</span>
                                </Button>
                            </div>
                        </section>
                    ))}
                    <div className="flex gap-2">
                        <Button className="text-primary" type="button" variant="outline" onClick={() => append(defaultWorkExperience)}>Add Experience</Button>
                        <Button loading={isSubmitting}>Proceed</Button>
                    </div>
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