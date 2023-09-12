import { Formik } from 'formik';
import { useState } from 'react';
import { Button, Input, Rating, Status_Lookup } from 'ui';
import type { Job } from '~contents/get-job-details';
import { Sheet, type SheetProps } from './sheet';

interface JobInfoSheetProps<T> extends SheetProps {
    entity: T
    onSubmit: (job: T) => Promise<void>
}

/**
 * Sheets component for editing job items
 */
// TODO: unify the shadcn ui & personal input components
export function JobInfoSheet(props: JobInfoSheetProps<Job>) {
    const entity = props.entity;
    const [isSubmitting, setSubmitting] = useState(false)
    // TODO: handle error properly
    const onSubmit = async (job: Job) => {
        setSubmitting(true)
        try {
            await props.onSubmit(job)
        } catch (err) {
            // TODO: handle error
        } finally {
            setSubmitting(false)
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
                    {({ values, handleSubmit, handleChange, setFieldValue }) => (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                            <p className='px-3.5 py-2.5 hidden' />
                            <Input
                                placeholder="Job title"
                                value={values.position}
                                name="position"
                                label='Position'
                                onChange={handleChange}
                            />

                            <div className="mb-4">
                                <div className="mb-1.5">Rating</div>
                                <Rating
                                    onClick={(val) => setFieldValue('priority', val)}
                                    size="md"
                                    value={values.priority ?? 0}
                                />
                            </div>

                            <Input
                                placeholder="Company name"
                                name="company_name"
                                onChange={handleChange}
                                label='Company Name'
                                value={values.company_name}
                            />
                            <Input
                                placeholder="Location"
                                name="location"
                                label='Location'
                                onChange={handleChange}
                                value={values.location ?? ''}
                            />
                            <Input
                                placeholder="Company site"
                                name="company_site"
                                label='Company Site'
                                onChange={handleChange}
                                value={values.company_site ?? ''}
                                hint='Helps for rendering company logo'
                            />
                            <Button variant='default' loading={isSubmitting}>
                                Add to Job Quest
                            </Button>
                            <Button type='button' variant='ghost' onClick={_ => props.onOpenChange(false)}>
                                Close
                            </Button>
                        </form>
                    )}
                </Formik>
            </div>
        </Sheet>
    )
}