import { Textarea } from '@components/textarea'
import { type Education } from '@lib/types'
import { Trash2 } from 'lucide-react'
import { type FieldArrayWithId, type UseFormReturn } from 'react-hook-form'
import { Button, Input } from 'ui'

interface EducationFormProps {
    form: UseFormReturn<{ education: Education[] }>
    index: number,
    field: FieldArrayWithId<{ workExperience: Education[] }>,
    onDeleteClick: (experience: Education, index: number) => void
}

export function EducationForm({ form, index, onDeleteClick, field }: EducationFormProps) {
    const { register } = form
    return (
        <section className="p-4 border bg-white mb-8">
            <section className="mb-4 grid grid-cols-2 gap-3 rounded-md">
                <input type="hidden" {...register(`education.${index}.id`)} />
                <Input
                    autoFocus
                    label="Institution"
                    placeholder="Institution of study..."
                    {...register(`education.${index}.institution`)}
                />
                <Input
                    label="Field of Study"
                    placeholder="Field of study..."
                    {...register(`education.${index}.field_of_study`)}
                />
                <Input
                    label="Location"
                    placeholder="Location..."
                    {...register(`education.${index}.location`)}
                />
                <Input
                    type="date"
                    label="Start Date"
                    placeholder="Start Date..."
                    {...register(`education.${index}.start_date`)}
                />
                <Input
                    type="date"
                    label="End Date"
                    placeholder="End Date..."
                    {...register(`education.${index}.end_date`)}
                />
            </section>
            <Textarea
                placeholder="A summary of what you did in this role"
                label="Highlights"
                rows={5}
                className="mb-4"
                {...register(`education.${index}.highlights`)}
            />
            <div className="flex justify-end gap-2">
                <Button
                    size="sm"
                    className="text-red-400 flex items-center gap-1"
                    type="button"
                    variant="outline"
                    onClick={() => onDeleteClick(field, index)}
                >
                    <Trash2 size={18} />
                    <span>Remove Block</span>
                </Button>
            </div>
        </section>
    )
}
