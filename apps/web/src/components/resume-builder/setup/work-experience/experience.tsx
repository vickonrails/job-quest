import { Trash2 } from 'lucide-react'
import { useRef } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { type FormFields } from 'src/pages/profile/setup'
import { Button, Input } from 'ui'
import { StepContainer } from '../container'
import { Highlights, type RefTypeWorkExperience } from './highlights'

export function WorkExperience() {
    const { register, control } = useFormContext<FormFields>()
    const { fields, append } = useFieldArray({
        name: 'workExperience',
        control
    })

    const highlightRef = useRef<RefTypeWorkExperience>(null)

    return (
        <StepContainer title="Work Experience">
            <p className="mb-4 text-gray-500">Work Experience.</p>
            <form>
                {fields.map((field, index) => (
                    <section className="p-4 border mb-8" key={field.id}>
                        <section className="mb-4 grid grid-cols-2 gap-3 rounded-md" key={field.id}>
                            <Input label="Company Name" placeholder="Company name" {...register(`workExperience.${index}.company`)} />
                            <Input label="Title" placeholder="Job titled held..." {...register(`workExperience.${index}.title`)} />
                            <Input label="Location" placeholder="Location..." {...register(`workExperience.${index}.location`)} />
                            <Input type="date" label="Start Date" placeholder="Start Date..." {...register(`workExperience.${index}.startDate`)} />
                            <Input type="date" label="End Date" placeholder="End Date..." {...register(`workExperience.${index}.endDate`)} />

                            <Highlights index={index} ref={highlightRef} />
                        </section>
                        <div className="flex justify-end gap-2">
                            <Button size="sm" type="button" variant="outline" onClick={() => highlightRef.current?.append({ text: '' })}>Add Highlight</Button>
                            <Button size="sm" className="text-red-400 flex items-center gap-1" type="button" variant="outline">
                                <Trash2 size={18} />
                                <span>Remove Block</span>
                            </Button>
                        </div>
                    </section>
                ))}
            </form>
            <div className="flex justify-end">
                <Button className="text-primary" variant="outline" onClick={() => append({ highlights: [{}] })}>Add New</Button>
            </div>
        </StepContainer>
    )
}