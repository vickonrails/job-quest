import { Formik } from 'formik';
import { useState } from 'react';
import { Button, Input, Rating, Banner } from 'ui';
import { Sheet, type SheetProps } from './sheet';
import type { Job } from '~types';

interface JobInfoSheetProps<T> extends SheetProps {
    entity: T
    onSubmit: (job: T) => Promise<void>
}

interface useFormProps<T> {
    onSubmit: (entity: T) => Promise<void>
    entity: T
}

enum FormStatus {
    IDLE = 'idle',
    SUBMITTING = 'submitting',
    SUCCESS = 'success',
    ERROR = 'error',
}

const useForm = <T extends {}>({ onSubmit, entity }: useFormProps<T>) => {
    const [isSubmitting, setSubmitting] = useState(false)
    const [initialValues] = useState(entity)
    const [status, setStatus] = useState(FormStatus.IDLE)

    const handleSubmit = async (entity: T) => {
        setStatus(FormStatus.SUBMITTING)
        setSubmitting(true)
        try {
            // might need to throw error here
            await onSubmit(entity);
            setStatus(FormStatus.SUCCESS)
        } catch {
            setStatus(FormStatus.ERROR)
            // handle error
        } finally {
            setSubmitting(false)
        }
    }

    return {
        isSubmitting,
        handleSubmit,
        initialValues,
        status
    }
}
/**
 * Sheets component for editing job items
 */
export function JobInfoSheet(props: JobInfoSheetProps<Job>) {
    const { initialValues, isSubmitting, handleSubmit, status } = useForm({
        onSubmit: props.onSubmit,
        entity: props.entity
    })

    return (
        <Sheet {...props}>
            <div className="flex flex-col gap-3">
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleSubmit, handleChange, setFieldValue }) => (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                            {/* TODO: render either error or success depending on the state of the submit */}
                            {status === FormStatus.SUCCESS && (
                                <Banner
                                    variant='success'
                                    message='Job added to JobQuest'
                                />
                            )}

                            {status === FormStatus.ERROR && (
                                <Banner
                                    variant='error'
                                    message='Could not add job to JobQuest'
                                />
                            )}
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
                            <Button
                                variant='default'
                                loading={isSubmitting}
                                disabled={status === FormStatus.SUCCESS || status === FormStatus.ERROR}
                            >
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