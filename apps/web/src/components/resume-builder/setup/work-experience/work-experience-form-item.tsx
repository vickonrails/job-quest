import { Checkbox } from '@components/checkbox'
import { Textarea } from '@components/textarea'
import { type WorkExperience } from '@lib/types'
import { Trash2 } from 'lucide-react'
import { Controller, useWatch, type FieldArrayWithId, type UseFormReturn } from 'react-hook-form'
import { Button, Input } from 'ui'
import { ErrorHint } from '../error-hint'

interface WorkExperienceFormProps {
    form: UseFormReturn<{ workExperience: WorkExperience[] }>
    index: number,
    field: FieldArrayWithId<{ workExperience: WorkExperience[] }>,
    onDeleteClick: (experience: WorkExperience, index: number) => void
}

export function WorkExperienceForm({ form, index, field, onDeleteClick }: WorkExperienceFormProps) {
    const { register, formState: { errors } } = form
    const fieldErrs = errors?.workExperience?.[index] ?? {}
    const stillWorking = useWatch({ control: form.control, name: `workExperience.${index}.still_working_here` })

    return (
        <section className="p-4 border bg-white mb-8">
            <section className="mb-4 grid grid-cols-2 gap-3 rounded-md">
                <input type="hidden" {...register(`workExperience.${index}.id`)} />
                <Input
                    label="Company Name"
                    placeholder="Company name"
                    hint={<ErrorHint>{fieldErrs.company_name?.message}</ErrorHint>}
                    {...register(`workExperience.${index}.company_name`, { required: { message: 'Company name is required', value: true } })}
                />
                <Input
                    label="Title"
                    placeholder="Job titled held..."
                    hint={<ErrorHint>{fieldErrs.job_title?.message}</ErrorHint>}
                    {...register(`workExperience.${index}.job_title`, { required: { message: 'Job Title is required', value: true } })}
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
                    hint={<ErrorHint>{fieldErrs.start_date?.message}</ErrorHint>}
                    {...register(`workExperience.${index}.start_date`, { required: { message: 'Start date is required', value: true } })}
                />

                <Controller
                    name={`workExperience.${index}.still_working_here`}
                    control={form.control}
                    render={({ field: item }) => (
                        <Checkbox
                            label="I'm Still Working Here?"
                            checked={item.value ?? false}
                            onCheckedChange={val => item.onChange(val)}
                            className="h-[84px]"
                        />
                    )}
                />

                {!stillWorking && (<Input
                    type="date"
                    label="End Date"
                    placeholder="End Date..."
                    hint={<ErrorHint>{fieldErrs.end_date?.message}</ErrorHint>}
                    disabled={Boolean(stillWorking)}
                    {...register(`workExperience.${index}.end_date`, { required: { message: 'End date is required', value: true } })}
                />)}

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