import { ErrorHint } from '@components/resume-builder/setup/components/error-hint';
import { useToast } from '@components/toast/use-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Database } from 'lib/database.types';
import { type Job } from 'lib/types';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Rating, Select, Status_Lookup } from 'ui';
import { v4 as uuid } from 'uuid';
import { Sheet, type SheetProps } from './sheet';

interface JobEditSheetProps<T> extends SheetProps {
    entity: T
}

/**
 * Sheets component for editing job items
 */
// TODO: unify the shadcn ui & personal input components
export function JobEditSheet<T>(props: JobEditSheetProps<T>) {
    const queryClient = useQueryClient();
    // TODO: abstract this away
    const client = useSupabaseClient<Database>();
    const entity = props.entity as Job;
    const statusOptions = Status_Lookup.map((x, idx) => ({ value: String(idx), label: x }))
    const { toast } = useToast()
    const { handleSubmit, reset, register, control, formState: { errors } } = useForm({ defaultValues: entity })

    const updateMutation = useMutation({
        mutationFn: async (data: { job: Job }) => {
            const { job } = data
            if (!job.id) {
                job.id = uuid()
            }
            return await client.from('jobs').upsert(job).eq('id', job.id)
        },
        // TODO: we're currently invalidating the cache now, but we can use setQueryData to just replace the job in the cache
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['jobs'] })
            props.onOpenChange?.(false)
        }
    })

    const onSubmit = async (job: Job) => {
        try {
            const { error } = await updateMutation.mutateAsync({ job });
            if (error) {
                throw error
            }
            toast({
                variant: 'success',
                title: 'Job updated'
            })
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'Error updating job',
            })
        }
    }

    const initialValues = { ...entity }

    return (
        <Sheet icons={props.icons} {...props}>
            <div className="flex flex-col gap-3">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                    <Input
                        autoFocus
                        placeholder="Job title"
                        label="Position"
                        hint={<ErrorHint>{errors.position?.message}</ErrorHint>}
                        {...register('position', { required: { value: true, message: 'Position is required' } })}
                    />

                    <div className="mb-4">
                        <div className="mb-3 text-sm">Rating</div>
                        <Controller
                            name="priority"
                            control={control}
                            render={({ field }) => (
                                <Rating
                                    onClick={(val) => field.onChange(val)}
                                    size="md"
                                    value={field.value ?? 0}
                                />
                            )}
                        />

                    </div>

                    <Controller
                        control={control}
                        name="status"
                        render={({ field }) => (
                            <Select
                                options={statusOptions}
                                label="Select"
                                value={String(field.value)}
                                trigger="Select a status"
                                onValueChange={(val: string) => field.onChange(Number(val))}
                            />
                        )}
                    />

                    <Input
                        placeholder="Company name"
                        label="Company name"
                        hint={<ErrorHint>{errors.company_name?.message}</ErrorHint>}
                        {...register('company_name', { required: { value: true, message: 'Company name is required' } })}
                    />
                    <Input
                        placeholder="Location"
                        label="Location"
                        {...register('location')}
                    />
                    <Button type="submit" loading={updateMutation.isLoading}>{entity ? 'Update' : 'Create'}</Button>
                    <Button type="button" variant="ghost" onClick={() => reset(initialValues)}>Clear Changes</Button>
                </form>
            </div>
        </Sheet>
    )
}