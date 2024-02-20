import { type Highlight, type WorkExperience } from '@lib/types'
import { type UseFormReturn, useFieldArray } from 'react-hook-form'
import { Textarea } from 'ui'
import { HighlightFooter } from '../components/highlights-footer'

interface HighlightsProps {
    form: UseFormReturn<{ workExperience: WorkExperience[] }>
    index: number,
    onDeleteClick: () => void
    entity: WorkExperience
}

export function WorkExperienceHighlights({ form, index, onDeleteClick, entity }: HighlightsProps) {
    const { fields, remove, append } = useFieldArray({ name: `workExperience.${index}.highlights`, control: form.control, keyName: '_id' })
    return (
        <>
            <section className="mb-4">
                {fields.map((field, idx) => (
                    <section key={field._id} className="mb-2 flex flex-col items-end">
                        <Textarea
                            placeholder="A summary of what you did in this role"
                            label={idx === 0 ? 'Highlights' : ''}
                            containerClasses="w-full mb-1"
                            rows={2}
                            {...form.register(`workExperience.${index}.highlights.${idx}.text`)}
                        />
                        <button className="text-xs" onClick={() => remove(idx)}>Remove</button>
                    </section>
                ))}
            </section>

            <HighlightFooter
                onDeleteClick={onDeleteClick}
                addHighlight={() => append(getDefaultEntity(entity.id))}
            />
        </>
    )
}

function getDefaultEntity(id: string): Highlight {
    return {
        text: '',
        work_experience_id: id,
        type: 'work_experience'
    } as unknown as Highlight
} 