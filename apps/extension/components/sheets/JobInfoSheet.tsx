import { Formik } from 'formik'
import { Sheet, type SheetProps } from './sheet';
import type { Job } from '~contents/get-job-details';
import { Button, Input, Rating } from 'ui'

interface JobInfoSheetProps<T> extends SheetProps {
    entity: T
    onSubmit: (job: Job) => void
}

export const Status_Lookup = [
    'Bookmarked',
    'Applying',
    'Applied',
    'Interviewing',
    'Rejected',
    'Negotiating',
    'Hired',
]

/**
 * Sheets component for editing job items
 */
// TODO: unify the shadcn ui & personal input components
export function JobInfoSheet(props: JobInfoSheetProps<Job>) {
    const entity = props.entity;
    const onSubmit = async (job: Job) => {
        try {
            props.onSubmit(job)
        } catch (err) {
            // TODO: handle error
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
                    {({ values, handleSubmit, handleChange, isSubmitting, setFieldValue }) => (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                            <Input
                                placeholder="Job title"
                                value={values.position}
                                name="position"
                                label='Position'
                                onChange={handleChange}
                            />

                            <div className="mb-4">
                                <div className="mb-3 mb-1.5">Rating</div>
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
                            />
                            <Button variant='default' loading={isSubmitting}>
                                Update
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