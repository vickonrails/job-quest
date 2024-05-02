import { ErrorHint } from '@components/resume-builder/setup/components/error-hint';
import { useToast } from '@components/toast/use-toast';
import { createClient } from '@lib/supabase/component';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Job } from 'lib/types';
import { Controller, useForm } from 'react-hook-form';
import { Status_Lookup } from 'shared';
import { useUserContext } from 'src/pages/_app';
import { Button, Input, Rating, Select } from 'ui';
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
    const client = createClient();
    const entity = props.entity as Job;
    const statusOptions = Status_Lookup.map((x, idx) => ({ value: String(idx), label: x }))
    const { handleSubmit, reset, register, control, formState: { errors } } = useForm({ defaultValues: entity })
    const { toast } = useToast()
    const user = useUserContext()

    const updateMutation = useMutation({
        mutationFn: async (data: { job: Job, userId: string }) => {
            const { job, userId } = data
            const isNew = !Boolean(job.id)
            if (!job.id) {
                job.id = uuid()
            }

            if (isNew) {
                const { data: count } = await client
                    .from('jobs')
                    .select('*')
                    .order('order_column', { ascending: false })
                    .eq('status', job.status ?? 0)
                    .eq('user_id', userId)
                    .limit(1).single();

                const maxColumn = !count ? 0 : count?.order_column;
                job.order_column = maxColumn ? maxColumn + 10 : 10;
            }
            // turns out this fails if there are no jobs in the database
            return await client.from('jobs').upsert({ ...job, user_id: userId }).eq('id', job.id)
        },
        // TODO: we're currently invalidating the cache now, but we can use setQueryData to just replace the job in the cache
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['jobs'] })
            props.onOpenChange?.(false)
        }
    })

    const onSubmit = async (job: Job) => {
        try {
            if (!user?.id) throw new Error('Not Authenticated')
            const { error } = await updateMutation.mutateAsync({ job, userId: user?.id });
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