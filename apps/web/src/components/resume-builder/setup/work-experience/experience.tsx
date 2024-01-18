import { AlertDialog } from '@components/alert-dialog'
import { Spinner } from '@components/spinner'
import { useToast } from '@components/toast/use-toast'
import { type Database } from '@lib/database.types'
import { type WorkExperience as IWorkExperience, type WorkExperience, type WorkExperienceInsertDTO } from '@lib/types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDeleteModal } from 'src/hooks/useDeleteModal'
import { useSetupContext } from 'src/hooks/useSetupContext'
import { fetchWorkExperience } from 'src/pages/profile/setup'
import { Button, Input } from 'ui'
import { v4 as uuid } from 'uuid'
import { StepContainer } from '../container'

// TODO: to prevent data loss when navigating, I could do a couple of things
// automatically save the record for the user
// show the a badge showing which items are saved and which are not
// prevent the user from leaving the page until they save the data

export function WorkExperience() {
    const client = useSupabaseClient<Database>()
    const queryClient = useQueryClient()
    const { toast } = useToast()
    const { session, next } = useSetupContext()
    const [removeIdx, setRemoveIdx] = useState<number>();
    const { data, isLoading, } = useQuery(['work_experience'], () => fetchWorkExperience({ userId: session?.user.id, client }), { staleTime: 1000 * 60 });
    const { handleSubmit, control, register, formState: { isSubmitting }, reset } = useForm<{ workExperience: WorkExperience[] }>({
        defaultValues: { workExperience: data ?? [getDefaultExperience()] }
    })

    const { fields, append, remove } = useFieldArray({
        name: 'workExperience',
        control,
        keyName: '_id'
    })

    useEffect(() => {
        reset({ workExperience: data ?? [getDefaultExperience()] })
    }, [data, reset])

    const { showDeleteDialog, onCancel, handleDelete, loading, setIsOpen, isOpen } = useDeleteModal({
        onDelete: async (id: string) => {
            const { error } = await client.from('work_experience').delete().eq('id', id)
            if (error) throw error;
        }
    });

    const updateWorkExperience = useMutation({
        mutationFn: async ({ values, userId }: { values: WorkExperience[], userId: string }) => {
            if (!session) return
            // normalize data (add user_id and id if not present)
            const preparedValues = values.map(work => {
                if (!work.user_id) {
                    work.user_id = session?.user.id
                    work.id = uuid()
                }
                return work
            })
            const { data, error } = await client.from('work_experience').upsert(preparedValues).eq('user_id', userId).select('*');
            if (error) throw error;

            return data;
        },
        onSuccess: async (data) => {
            // it's okay to move to next step before cache is updated
            await next();
            queryClient.setQueryData(['work_experience'], data);
            reset({ workExperience: data })
        }
    })

    const onDeleteClick = (experience: WorkExperienceInsertDTO, index: number) => {
        // just remove item if we haven't persisted
        if (!experience.id) {
            remove(index);
            return;
        }

        setRemoveIdx(index);
        if (!experience.id) return
        showDeleteDialog({ ...experience, id: experience.id });
    }

    const onSubmit = async (values: { workExperience: WorkExperience[] }) => {
        if (!session) return;
        try {
            await updateWorkExperience.mutateAsync({ userId: session?.user.id, values: values.workExperience });
        } catch (error) {
            toast({
                title: 'An error occured',
                variant: 'destructive'
            })
        }
    }

    const onDeleteOk = async () => {
        await handleDelete();
        remove(removeIdx);
        await queryClient.refetchQueries(['work_experience']);
    }

    if (isLoading) return (
        <div className="inline-grid place-items-center mt-12 w-full">
            <Spinner />
        </div>
    )

    return (
        <>
            <StepContainer title="Work Experience">
                <p className="mb-4 text-gray-500">Work Experience.</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {fields.map((field, index) => (
                        <section className="p-4 border bg-white mb-8" key={field.id}>
                            <section className="mb-4 grid grid-cols-2 gap-3 rounded-md" key={field._id}>
                                <input type="hidden" {...register(`workExperience.${index}.id`)} />
                                <Input label="Company Name" placeholder="Company name" {...register(`workExperience.${index}.company_name`)} />
                                <Input label="Title" placeholder="Job titled held..." {...register(`workExperience.${index}.job_title`)} />
                                <Input label="Location" placeholder="Location..." {...register(`workExperience.${index}.location`)} />
                                <Input type="date" label="Start Date" placeholder="Start Date..." {...register(`workExperience.${index}.start_date`)} />
                                <Input type="date" label="End Date" placeholder="End Date..." {...register(`workExperience.${index}.end_date`)} />
                            </section>
                            <div className="flex justify-end gap-2">
                                <Button size="sm" type="button" variant="outline">Add Highlight</Button>
                                <Button size="sm" className="text-red-400 flex items-center gap-1" type="button" variant="outline" onClick={() => onDeleteClick(field, index)}>
                                    <Trash2 size={18} />
                                    <span>Remove Block</span>
                                </Button>
                            </div>
                        </section>
                    ))}
                    <div className="flex gap-2">
                        <Button className="text-primary" type="button" variant="outline" onClick={() => append(getDefaultExperience())}>Add Experience</Button>
                        <Button loading={isSubmitting}>Save & Proceed</Button>
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

function getDefaultExperience() {
    const experience = {
        company_name: '',
        job_title: '',
        location: '',
        start_date: '',
        end_date: '',
        highlights: [],
    } as unknown as IWorkExperience

    return experience
}