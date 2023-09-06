// import { type Job } from 'lib/types';
// import { Input } from '@components/input';
// import { Select } from '@components/select';
// import { Button } from '@components/button';
import { Formik } from 'formik'
// import { Rating } from '@components/rating/Rating';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
// import { type Database } from 'lib/database.types'
import { Sheet, type SheetProps } from './sheet';
import type { Job } from '~contents/get-job-details';
import { Select } from '../ui/select'
import { Input } from '~components/ui/input';
import { Button } from '~components/ui/button';
// import { Status_Lookup } from '@components/table/job/JobsTable';
// import { useToast } from '@components/toast/use-toast';

interface JobInfoSheetProps<T> extends SheetProps {
    entity: T
    onSubmit: (job: Job) => void
}
/**
 * Sheets component for editing job items
 */
// TODO: unify the shadcn ui & personal input components
export function JobInfoSheet(props: JobInfoSheetProps<Job>) {
    // const queryClient = useQueryClient();
    // TODO: there's no database type for now
    // const client = useSupabaseClient();
    const entity = props.entity;

    // const updateMutation = useMutation({
    //     mutationFn: async (data) => {
    //         return await client.from('jobs').update(data).eq('id', entity.id)
    //     },
    //     // TODO: we're currently invalidating the cache now, but we can use setQueryData to just replace the job in the cache
    //     onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] })
    // })

    const onSubmit = async (job: Job) => {
        try {
            console.log({ job, props })
            props.onSubmit(job)
        } catch (err) {
            // 
        }
    }

    const initialValues = { ...entity }

    return (
        <Sheet {...props} >
            <div className="flex flex-col gap-3">
                <h2 className='text-2xl'>Edit Job</h2>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                >
                    {({ values, handleSubmit, handleChange, isSubmitting }) => (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <Input
                                placeholder="Job title"
                                value={values.position}
                                name="position"
                                onChange={handleChange}
                            />

                            {/* <div className="mb-4">
                                <div className="mb-3">Rating</div>
                                <Rating
                                    onClick={(val) => setFieldValue('priority', val)}
                                    size="md"
                                    value={values.priority ?? 0}
                                />
                            </div> */}

                            {/* TODO: figure out why there is no highlight on the select options */}
                            {/* <Select
                                name="status"
                                label="Select"
                                trigger="Select a status"
                                // TODO: figure out why just handleChange doesn't seem to work here
                                onValueChange={val => setFieldValue('status', Number(val))}
                                options={statusOptions}
                                value={String(values.status)}
                            /> */}

                            <Select>

                            </Select>

                            <Input
                                placeholder="Company name"
                                name="company_name"
                                onChange={handleChange}
                                value={values.company_name}
                            />
                            <Input
                                placeholder="Location"
                                name="location"
                                onChange={handleChange}
                                value={values.location ?? ''}
                            />
                            <Input
                                placeholder="Company site"
                                name="company_site"
                                onChange={handleChange}
                                value={values.company_site ?? ''}
                            />
                            <Button type="submit" variant='default'>
                                {isSubmitting ? 'Updating...' : 'Update'}
                            </Button>
                        </form>
                    )}
                </Formik>
            </div>
        </Sheet>
    )
}