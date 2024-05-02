import { type Highlight, type WorkExperience } from '@lib/types'
import { type Dispatch, type SetStateAction } from 'react'
import { useFieldArray, type UseFormReturn } from 'react-hook-form'
import { Textarea } from 'ui'
import { HighlightFooter } from '../components/highlights-footer'
import { v4 as uuid } from 'uuid'
import { useUserContext } from 'src/pages/_app'

interface HighlightsProps {
    form: UseFormReturn<{ workExperience: WorkExperience[] }>
    index: number,
    onDeleteClick: () => void
    entity: WorkExperience
    onHighlightDelete?: Dispatch<SetStateAction<string[]>>
}

export function WorkExperienceHighlights({ form, index, onDeleteClick, entity, onHighlightDelete }: HighlightsProps) {
    const { fields, remove, append } = useFieldArray({ name: `workExperience.${index}.highlights`, control: form.control, keyName: '_id' })
    const user = useUserContext();

    const handleRemove = (idx: number) => {
        const highlight = fields[idx]
        if (highlight?.id) {
            onHighlightDelete?.((prev) => [...prev, highlight.id])
        }
        remove(idx)
    }

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
                        <button className="text-xs" onClick={() => handleRemove(idx)}>Remove</button>
                    </section>
                ))}
            </section>

            <HighlightFooter
                onDeleteClick={onDeleteClick}
                addHighlight={() => append(getDefaultEntity({ id: entity.id, userId: user?.id }))}
            />
        </>
    )
}

function getDefaultEntity({ id, userId }: { id: string, userId?: string }): Highlight {
    return {
        text: '',
        id: uuid(),
        work_experience_id: id,
        user_id: userId,
        type: 'work_experience'
    } as unknown as Highlight
} 