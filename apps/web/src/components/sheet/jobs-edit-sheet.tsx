'use client'

import { updateJob } from '@/actions/job';
import { ErrorHint } from '@/components/resume-builder/setup/components/error-hint';
import { useToast } from '@/components/toast/use-toast';
import { createClient } from '@/utils/supabase/client';
import { type Job } from 'lib/types';
import { Controller, useForm } from 'react-hook-form';
import { Status_Lookup } from 'shared';
import { Button, Input, Rating, Select } from 'ui';
import { Sheet, type SheetProps } from './sheet';

interface JobEditSheetProps<T> extends SheetProps {
    entity: T
}

/**
 * Sheets component for editing job items
 */
// TODO: unify the shadcn ui & personal input components
export function JobEditSheet<T>(props: JobEditSheetProps<T>) {
    const client = createClient();
    const entity = props.entity as Job;
    const statusOptions = Status_Lookup.map((x, idx) => ({ value: String(idx), label: x }))
    const { handleSubmit, reset, register, control, formState: { errors, isSubmitting } } = useForm({ defaultValues: entity })
    const { toast } = useToast()

    const onSubmit = async (job: Job) => {
        const { data: { user } } = await client.auth.getUser()
        try {
            if (!user?.id) throw new Error('Not Authenticated')
            const result = await updateJob(job, user.id)
            // TODO: better error message?
            if (!result.success) throw new Error('')
            toast({
                variant: 'success',
                title: 'Job updated',
            })
            reset()
            props?.onOpenChange?.(false)
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
                    <Button type="submit" loading={isSubmitting}>{entity ? 'Update' : 'Create'}</Button>
                    <Button type="button" variant="ghost" onClick={() => reset(initialValues)}>Clear Changes</Button>
                </form>
            </div>
        </Sheet>
    )
}