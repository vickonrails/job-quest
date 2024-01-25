import { Textarea } from '@components/textarea'
import { type Project } from '@lib/types'
import { Trash2 } from 'lucide-react'
import { type FieldArrayWithId, type UseFormReturn } from 'react-hook-form'
import { Button, Input } from 'ui'

interface ProjectsFieldsProps {
    form: UseFormReturn<{ projects: Project[] }>
    index: number,
    field: FieldArrayWithId<{ project: Project[] }>,
    onDeleteClick: (project: Project, index: number) => void
}

export function ProjectFields({ form, index, field, onDeleteClick }: ProjectsFieldsProps) {
    const { register } = form
    return (
        <section className="p-4 border bg-white mb-8">
            <section className="mb-4 grid grid-cols-2 gap-3 rounded-md">
                <Input
                    label="Project Title..."
                    placeholder="Title"
                    {...register(`projects.${index}.title`)}
                />
                <Input
                    label="URL"
                    placeholder="Link to Demo..."
                    {...register(`projects.${index}.url`)}
                />
                <Input
                    type="date"
                    label="Start Date"
                    placeholder="Start Date..."
                    {...register(`projects.${index}.start_date`)}
                />
                <Input
                    type="date"
                    label="End Date"
                    placeholder="End Date..."
                    {...register(`projects.${index}.end_date`)}
                />
            </section>
            <Textarea
                placeholder="A summary of what you did in this role"
                label="Project description"
                rows={5}
                className="mb-4"
                {...register(`projects.${index}.highlights`)}
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