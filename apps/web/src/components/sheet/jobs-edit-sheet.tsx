'use client'

import { ErrorHint } from '@/components/resume-builder/setup/components/error-hint';
import { useToast } from '@/components/toast/use-toast';
import { createClient } from '@/utils/supabase/client';
import { type SupabaseClient } from '@supabase/supabase-js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Job } from 'lib/types';
import { Controller, useForm } from 'react-hook-form';
import { Status_Lookup, type Database } from 'shared';
import { Button } from 'ui/button';
import { Input } from 'ui/input';
import { Label } from 'ui/label';
import { Rating } from 'ui/rating';
import { Select } from 'ui/select';
import { v4 as uuid } from 'uuid';
import { Sheet, type SheetProps } from './sheet';

interface JobEditSheetProps<T> extends SheetProps {
    entity: T
    onSuccess?: () => Promise<void>
}

async function updateJob(client: SupabaseClient<Database>, job: Job, userId: string) {
    return await client.from('jobs').upsert({ ...job, user_id: userId });
}

/**
 * Sheets component for editing job items
 */
// TODO: unify the shadcn ui & personal input components
export function JobEditSheet<T>(props: JobEditSheetProps<T>) {
    const client = createClient();
    // const queryClient = useQueryClient()
    const entity = props.entity as Job;
    const statusOptions = Status_Lookup.map((x, idx) => ({ value: String(idx), label: x }))
    const { handleSubmit, reset, register, control, formState: { errors, isSubmitting } } = useForm({ defaultValues: entity })
    const { toast } = useToast()

    // TODO: move mutation to outside modal
    const updateJobMutation = useMutation({
        mutationFn: async (job: Job) => {
            const initialJob = props.entity;

            const { data: { user } } = await client.auth.getUser()
            if (!user) return

            let movingColumns;

            const isNew = !Boolean(job.id)
            if (!job.id) {
                job.id = uuid();
            }

            if (initialJob) {
                // @ts-ignore
                movingColumns = props.entity.status !== job.status;
            }

            if (isNew || movingColumns) {
                const { data: count } = await client
                    .from('jobs')
                    .select('*')
                    .order('order_column', { ascending: false })
                    .eq('status', job.status ?? 0)
                    .eq('user_id', user.id)
                    .limit(1).single();

                const maxColumn = !count ? 0 : count?.order_column;
                job.order_column = maxColumn ? maxColumn + 10 : 10;
            }
            const { error } = await updateJob(client, job, user.id)
            if (error) throw error
        },
        onSuccess: async () => {
            props.onSuccess && await props?.onSuccess()
            // await queryClient.invalidateQueries({ queryKey: ['jobs'] })
            props?.onOpenChange?.(false)
            toast({
                variant: 'success',
                title: 'Job updated',
            })
            reset()
        },
        onError() {
            toast({
                variant: 'destructive',
                title: 'Error updating job',
            })
        },
    })

    const onSubmit = async (job: Job) => {
        await updateJobMutation.mutateAsync(job)
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
                        <Label className="mb-3">Rating</Label>
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
                                label="Select status"
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
                    <Button type="submit" loading={isSubmitting}>{entity ? 'Update' : 'Create'}</Button>
                    <Button type="button" variant="ghost" onClick={() => reset(initialValues)}>Clear Changes</Button>
                </form>
            </div>
        </Sheet>
    )
}