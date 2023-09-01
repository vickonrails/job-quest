import { type Job } from 'lib/types';
import { Input } from '@components/input';
import { Select } from '@components/select';
import { Button } from '@components/button';
import { Formik } from 'formik'
import { Rating } from '@components/rating/Rating';
import { useMutation } from '@tanstack/react-query';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from 'lib/database.types'
import { Sheet, type SheetProps } from './sheet';
import { Status_Lookup } from '@components/table/job/JobsTable';
import { useToast } from '@components/toast/use-toast';

interface JobEditSheetProps<T> extends SheetProps {
    entity: T
}

/**
 * Sheets component for editing job items
 */
// TODO: unify the shadcn ui & personal input components
export function JobEditSheet<T>(props: JobEditSheetProps<T>) {
    // TODO: abstract this away
    const client = useSupabaseClient<Database>();
    const entity = props.entity as Job;
    const statusOptions = Status_Lookup.map((x, idx) => ({ value: String(idx), label: x }))
    const { toast } = useToast()

    const updateMutation = useMutation({
        mutationKey: ['jobs'],
        mutationFn: async (data: Job) => {
            return await client.from('jobs').update(data).eq('id', entity.id)
        }
    })

    const onSubmit = async (job: Job) => {
        try {
            const { error } = await updateMutation.mutateAsync(job);
            if (error) {
                throw error
            }
            toast({
                title: 'Job updated',
                duration: 3000
            })
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'Error updating job',
                duration: 3000
            })
        }
    }

    const initialValues = { ...entity }

    return (
        <Sheet {...props}>
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

                            <Select
                                name="status"
                                label="Select"
                                trigger="Select a status"
                                // TODO: figure out why just handleChange doesn't seem to work here
                                onValueChange={val => setFieldValue('status', Number(val))}
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
                            <Input
                                placeholder="Company site"
                                label="Company site"
                                name="company_site"
                                onChange={handleChange}
                                value={values.company_site ?? ''}
                                fullWidth
                                hint="For providing the company logo by the side"
                            />
                            <Button type="submit" loading={updateMutation.isLoading}>Update</Button>
                            <Button type="button" fillType="outlined" size="sm" onClick={() => resetForm(initialValues)}>Clear Changes</Button>
                        </form>
                    )}
                </Formik>
            </div>
        </Sheet>
    )
}