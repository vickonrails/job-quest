import { Checkbox } from '@components/checkbox'
import { Textarea } from '@components/textarea'
import { type Education } from '@lib/types'
import { Trash2 } from 'lucide-react'
import { Controller, useWatch, type FieldArrayWithId, type UseFormReturn } from 'react-hook-form'
import { Button, Input } from 'ui'
import { ErrorHint } from '../error-hint'

interface EducationFormProps {
    form: UseFormReturn<{ education: Education[] }>
    index: number,
    field: FieldArrayWithId<{ workExperience: Education[] }>,
    onDeleteClick: (experience: Education, index: number) => void
}

export function EducationForm({ form, index, onDeleteClick, field }: EducationFormProps) {
    const { register, formState: { errors } } = form
    const fieldErrs = errors?.education?.[index] ?? {}
    const stillStudying = useWatch({ control: form.control, name: `education.${index}.still_studying_here` })

    return (
        <section className="p-4 border bg-white mb-8">
            <section className="mb-4 grid grid-cols-2 gap-3 rounded-md">
                <input type="hidden" {...register(`education.${index}.id`)} />
                <Input
                    autoFocus
                    label="Institution"
                    placeholder="Institution of study..."
                    hint={<ErrorHint>{fieldErrs.institution?.message}</ErrorHint>}
                    {...register(`education.${index}.institution`, { required: { message: 'Institution is required', value: true } })}
                />
                <Input
                    label="Field of Study"
                    placeholder="Field of study..."
                    hint={<ErrorHint>{fieldErrs.field_of_study?.message}</ErrorHint>}
                    {...register(`education.${index}.field_of_study`, { required: { message: 'Field of Study is required', value: true } })}
                />
                <Input
                    label="Degree of Study"
                    placeholder="Degree..."
                    hint={<ErrorHint>{fieldErrs.degree?.message}</ErrorHint>}
                    {...register(`education.${index}.degree`, { required: { message: 'Degree is required', value: true } })}
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
                    hint={<ErrorHint>{fieldErrs.start_date?.message}</ErrorHint>}
                    {...register(`education.${index}.start_date`, { required: { message: 'Start date is required', value: true } })}
                />
                <Controller
                    name={`education.${index}.still_studying_here`}
                    control={form.control}
                    render={({ field: item }) => (
                        <Checkbox
                            label="I'm Still Studying Here?"
                            checked={item.value ?? false}
                            onCheckedChange={val => item.onChange(val)}
                            className="mt-6"
                        />
                    )}
                />

                {!stillStudying && (
                    <Input
                        type="date"
                        label="End Date"
                        placeholder="End Date..."
                        hint={<ErrorHint>{fieldErrs.end_date?.message}</ErrorHint>}
                        disabled={Boolean(stillStudying)}
                        {...register(`education.${index}.end_date`, { required: { message: 'End date is required', value: true } })}
                    />
                )}
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
