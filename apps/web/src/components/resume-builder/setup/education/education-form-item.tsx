import { Accordion, AccordionItem } from '@components/accordion'
import { Checkbox } from '@components/checkbox'
import { AccordionExpandIcon } from '@components/resume-builder/accordion-expand-icon'
import { DateRenderer } from '@components/resume-builder/date-renderer'
import { type Education } from '@lib/types'
import { Trash2 } from 'lucide-react'
import { Controller, useWatch, type FieldArrayWithId, type UseFormReturn } from 'react-hook-form'
import { Button, Input } from 'ui'
import { ErrorHint } from '../components/error-hint'

interface EducationFormProps {
    form: UseFormReturn<{ education: Education[] }, 'education'>
    fields: FieldArrayWithId<{ education: Education[] }, 'education', '_id'>[],
    onDeleteClick: (education: Education, index: number) => void
}

/** ------------------ Work Experience Header ------------------ */
function Header({ form, index }: { form: UseFormReturn<{ education: Education[] }, 'education'>, index: number }) {
    const experience = useWatch({ control: form.control, name: `education.${index}` })
    const { start_date, field_of_study, end_date, institution } = experience

    return (
        <header className="flex items-start justify-between group cursor-pointer hover:text-primary w-full p-4">
            <div>
                <p className="flex gap-2 select-none font-medium">{institution || 'Untitled...'}</p>
                <span className="text-sm text-muted-foreground">{field_of_study || 'Untitled...'}
                    <DateRenderer startDate={start_date} endDate={end_date ?? ''} />
                </span>
            </div>

            <AccordionExpandIcon />
        </header>
    )
}

export function EducationForm({ form, onDeleteClick, fields }: EducationFormProps) {
    return (
        <Accordion type="single" collapsible>
            {fields.map((field, index) => (
                <AccordionItem
                    header={<Header form={form} index={index} />}
                    value={field._id}
                    key={field._id}
                    className="border bg-white mb-2"
                >
                    <FormItem
                        form={form}
                        index={index}
                        onDeleteClick={onDeleteClick}
                        field={field}
                    />
                </AccordionItem>

            ))}
        </Accordion>
    )
}

interface FormItemProps {
    form: UseFormReturn<{ education: Education[] }>
    index: number,
    field: FieldArrayWithId<{ education: Education[] }, 'education', '_id'>,
    onDeleteClick: (education: Education, index: number) => void
}

function FormItem({ form, index, field, onDeleteClick }: FormItemProps) {
    const { register, formState: { errors } } = form
    const fieldErrs = errors?.education?.[index] ?? {}

    return (
        <div className="p-4 pt-0">
            <section className="mb-4 grid grid-cols-2 gap-3 rounded-md">
                <input type="hidden" {...register(`education.${index}.id`)} />
                <Input
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

                {!field.still_studying_here && (
                    <Input
                        type="date"
                        label="End Date"
                        placeholder="End Date..."
                        hint={<ErrorHint>{fieldErrs.end_date?.message}</ErrorHint>}
                        disabled={Boolean(field.still_studying_here)}
                        {...register(`education.${index}.end_date`, { required: { message: 'End date is required', value: true } })}
                    />
                )}
            </section>

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
        </div>
    )
}