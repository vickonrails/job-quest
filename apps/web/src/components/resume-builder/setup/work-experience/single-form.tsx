import { Textarea } from '@components/textarea'
import { type WorkExperience } from '@lib/types'
import { Trash2 } from 'lucide-react'
import { type FieldArrayWithId, type UseFormReturn } from 'react-hook-form'
import { Button, Input } from 'ui'

interface WorkExperienceFormProps {
    form: UseFormReturn<{ workExperience: WorkExperience[] }>
    index: number,
    field: FieldArrayWithId<{ workExperience: WorkExperience[] }>,
    onDeleteClick: (experience: WorkExperience, index: number) => void
}

export function WorkExperienceForm({ form, index, field, onDeleteClick }: WorkExperienceFormProps) {
    const { register } = form
    return (
        <section className="p-4 border bg-white mb-8">
            <section className="mb-4 grid grid-cols-2 gap-3 rounded-md">
                <input type="hidden" {...register(`workExperience.${index}.id`)} />
                <Input
                    autoFocus
                    label="Company Name"
                    placeholder="Company name"
                    {...register(`workExperience.${index}.company_name`)}
                />
                <Input
                    label="Title"
                    placeholder="Job titled held..."
                    {...register(`workExperience.${index}.job_title`)}
                />
                <Input
                    label="Location"
                    placeholder="Location..."
                    {...register(`workExperience.${index}.location`)}
                />
                <Input
                    type="date"
                    label="Start Date"
                    placeholder="Start Date..."
                    {...register(`workExperience.${index}.start_date`)}
                />
                <Input
                    type="date"
                    label="End Date"
                    placeholder="End Date..."
                    {...register(`workExperience.${index}.end_date`)}
                />
            </section>
            <Textarea
                placeholder="A summary of what you did in this role"
                label="Highlights"
                rows={5}
                className="mb-4"
                {...register(`workExperience.${index}.highlights`)}
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