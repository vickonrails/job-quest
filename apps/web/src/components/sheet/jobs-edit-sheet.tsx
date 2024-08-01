'use client'

import { ErrorHint } from '@/components/resume-builder/setup/components/error-hint';
import { useToast } from '@/components/toast/use-toast';
import { createClient } from '@/utils/supabase/client';
import { Content } from '@radix-ui/react-tabs';
import { type SupabaseClient } from '@supabase/supabase-js';
import { useMutation } from '@tanstack/react-query';
import { type Job } from 'lib/types';
import { Controller, useForm, type UseFormReturn } from 'react-hook-form';
import { Status_Lookup, type Database } from 'shared';
import { Button } from 'ui/button';
import { Input } from 'ui/input';
import { Label } from 'ui/label';
import { Rating } from 'ui/rating';
import { Select } from 'ui/select';
import { v4 as uuid } from 'uuid';
import { Editor } from '../editor/tiptap-editor';
import { JobSheetTabs } from './job-sheet-tabs';
import { Sheet, type SheetProps } from './sheet';

interface JobEditSheetProps<T> extends SheetProps {
    entity: T
    onSuccess?: () => Promise<void>
    showDescription?: boolean
}

async function updateJob(client: SupabaseClient<Database>, job: Job, userId: string) {
    return await client.from('jobs').upsert({ ...job, user_id: userId });
}

/**
 * Sheets component for editing job items
 */
// TODO: unify the shadcn ui & personal input components
export function JobEditSheet<T>({ showDescription = false, ...props }: JobEditSheetProps<T>) {
    const client = createClient();
    const entity = props.entity as Job;
    const form = useForm({ defaultValues: entity })
    const { handleSubmit, reset, formState: { isSubmitting } } = form
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
                const entity = props.entity as { status: number }
                movingColumns = entity.status !== job.status;
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
            <div className="flex flex-col gap-3 h-full">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 h-full">
                    {showDescription ?
                        <JobInfoWithSheets form={form} /> :
                        <JobBasicInfo form={form} />
                    }
                    <Button type="submit" loading={isSubmitting}>{entity ? 'Update' : 'Create'}</Button>
                    <Button type="button" variant="ghost" onClick={() => reset(initialValues)}>Clear Changes</Button>
                </form>
            </div>
        </Sheet>
    )
}

function JobInfoWithSheets({ form }: { form: UseFormReturn<Job> }) {
    const { control } = form
    return (
        <JobSheetTabs rootClassName="flex-1">
            <Content value="basic-info" className="flex flex-col gap-2 py-3">
                <JobBasicInfo form={form} />
            </Content>
            <Content value="description" className="flex flex-col gap-2 pb-3 flex-1">
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <Editor
                            value={field.value ?? ''}
                            label="Highlights"
                            rows={20}
                            containerProps={{className: 'h-[700px]'}}
                            onChange={text => field.onChange(text)}
                        />
                    )}
                />
            </Content>
        </JobSheetTabs>
    )
}

function JobBasicInfo({ form }: { form: UseFormReturn<Job> }) {
    const statusOptions = Status_Lookup.map((x, idx) => ({ value: String(idx), label: x }))
    const { register, formState: { errors }, control } = form
    return (
        <>
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
        </>
    )
}