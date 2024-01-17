import { type WorkExperience } from '@lib/types'
import { Trash2 } from 'lucide-react'
import { useRef } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useSetupContext } from 'src/hooks/useSetupContext'
import { type FormFields } from 'src/pages/profile/setup'
import { Button, Input } from 'ui'
import { StepContainer } from '../container'
import { Highlights, type RefTypeWorkExperience } from './highlights'

export function WorkExperience() {
    const { register, control, handleSubmit, formState: { isSubmitting } } = useFormContext<FormFields>()
    const { fields, append, remove } = useFieldArray({
        name: 'workExperience',
        control
    })
    const { next, updateWorkExperience, session } = useSetupContext()
    const highlightRef = useRef<RefTypeWorkExperience>(null)
    const onSubmit = async (values: FormFields) => {
        if (!session?.user.id) return;
        await updateWorkExperience(values, session?.user.id)
        next();
    }

    return (
        <StepContainer title="Work Experience">
            <p className="mb-4 text-gray-500">Work Experience.</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                {fields.map((field, index) => (
                    <section className="p-4 border mb-8" key={field.id}>
                        <section className="mb-4 grid grid-cols-2 gap-3 rounded-md" key={field.id}>
                            <Input label="Company Name" placeholder="Company name" {...register(`workExperience.${index}.company_name`)} />
                            <Input label="Title" placeholder="Job titled held..." {...register(`workExperience.${index}.job_title`)} />
                            <Input label="Location" placeholder="Location..." {...register(`workExperience.${index}.location`)} />
                            <Input type="date" label="Start Date" placeholder="Start Date..." {...register(`workExperience.${index}.start_date`)} />
                            <Input type="date" label="End Date" placeholder="End Date..." {...register(`workExperience.${index}.end_date`)} />

                            {/* <Highlights index={index} ref={highlightRef} /> */}
                        </section>
                        <div className="flex justify-end gap-2">
                            <Button size="sm" type="button" variant="outline" onClick={() => highlightRef.current?.append('')}>Add Highlight</Button>
                            <Button size="sm" className="text-red-400 flex items-center gap-1" type="button" variant="outline" onClick={() => remove(index)}>
                                <Trash2 size={18} />
                                <span>Remove Block</span>
                            </Button>
                        </div>
                    </section>
                ))}
                <div className="flex gap-2">
                    <Button className="text-primary" type="button" variant="outline" onClick={() => append({})}>Add Experience</Button>
                    <Button loading={isSubmitting}>Proceed</Button>
                </div>
            </form>
        </StepContainer>
    )
}