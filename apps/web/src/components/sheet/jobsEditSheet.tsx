import { useToast } from '@components/toast/use-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik } from 'formik';
import { type Database } from 'lib/database.types';
import { type Job } from 'lib/types';
import { Button, Input, Rating, Select, Status_Lookup } from 'ui';
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

    const updateMutation = useMutation({
        mutationFn: async (data: Job) => {
            return await client.from('jobs').update(data).eq('id', entity.id)
        },
        // TODO: we're currently invalidating the cache now, but we can use setQueryData to just replace the job in the cache
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] })
    })

    const onSubmit = async (job: Job) => {
        try {
            const { error } = await updateMutation.mutateAsync(job);
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
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                >
                    {({ values, handleSubmit, handleChange, setFieldValue, resetForm }) => (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                            <Input
                                placeholder="Job title"
                                value={values.position}
                                name="position"
                                fullWidth
                                label="Position"
                                onChange={handleChange}
                            />

                            <div className="mb-4">
                                <div className="mb-3 text-sm">Rating</div>
                                <Rating
                                    onClick={(val) => setFieldValue('priority', val)}
                                    size="md"
                                    value={values.priority ?? 0}
                                />
                            </div>

                            {/* TODO: figure out why there is no highlight on the select options */}
                            <Select
                                name="status"
                                label="Select"
                                trigger="Select a status"
                                // TODO: figure out why just handleChange doesn't seem to work here
                                onValueChange={(val: string) => setFieldValue('status', Number(val))}
                                options={statusOptions}
                                value={String(values.status)}
                            />
                            <Input
                                placeholder="Company name"
                                label="Company name"
                                name="company_name"
                                onChange={handleChange}
                                value={values.company_name}
                                fullWidth
                            />
                            <Input
                                placeholder="Location"
                                label="Location"
                                name="location"
                                onChange={handleChange}
                                value={values.location ?? ''}
                                fullWidth
                            />
                            <Button type="submit" loading={updateMutation.isLoading}>Update</Button>
                            <Button type="button" variant="ghost" onClick={() => resetForm(initialValues)}>Clear Changes</Button>
                        </form>
                    )}
                </Formik>
            </div>
        </Sheet>
    )
}