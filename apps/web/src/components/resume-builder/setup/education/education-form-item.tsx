import { Accordion, AccordionItem } from '@/components/accordion'
import { Editor } from '@/components/editor/tiptap-editor'
import { AccordionExpandIcon } from '@/components/resume-builder/accordion-expand-icon'
import { DateRenderer } from '@/components/resume-builder/date-renderer'
import { isAfter } from 'date-fns'
import { type Education } from 'lib/types'
import { useCallback } from 'react'
import { Controller, useWatch, type FieldArrayWithId, type UseFormReturn } from 'react-hook-form'
import { Checkbox } from 'ui/checkbox'
import { DatePicker } from 'ui/date-picker'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import { ErrorHint } from '../components/error-hint'
import { HighlightFooter } from '../components/highlights-footer'

export interface BaseFormItemProps {
    autofocus?: boolean
    defaultOpen?: boolean
}

interface EducationFormProps extends BaseFormItemProps {
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

export function EducationForm({ form, onDeleteClick, fields, defaultOpen, ...rest }: EducationFormProps) {
    const isDefaultOpen = defaultOpen ? (fields[0]?.id ?? '') : ''
    return (
        <Accordion type="single" collapsible defaultValue={isDefaultOpen}>
            {fields.map((field, index) =>
                <FormItem
                    form={form}
                    field={field}
                    index={index}
                    key={field.id}
                    onDeleteClick={onDeleteClick}
                    {...rest}
                />
            )}
        </Accordion>
    )
}

interface FormItemProps extends BaseFormItemProps {
    form: UseFormReturn<{ education: Education[] }>
    index: number,
    field: FieldArrayWithId<{ education: Education[] }, 'education', '_id'>,
    onDeleteClick: (education: Education, index: number) => void
}

function FormItem({ form, index, field, onDeleteClick, autofocus }: FormItemProps) {
    const { register, getValues, setError, clearErrors } = form
    const fieldErrs = form.formState.errors?.education?.[index] ?? {}

    const validate = useCallback(() => {
        clearErrors()
        const [start_date, end_date] = getValues([
            `education.${index}.start_date`,
            `education.${index}.end_date`
        ])

        if (!start_date || !end_date) return;

        const startDate = new Date(start_date)
        const endDate = new Date(end_date)

        const invalidDuration = isAfter(startDate, endDate)

        if (invalidDuration) {
            setError(`education.${index}.end_date`, {
                message: 'End date cannot be earlier than start date'
            })
            setError(`education.${index}.start_date`, {
                message: 'Start date cannot be later than end date'
            })
            return false;
        }

        return true
    }, [setError, getValues, clearErrors, index])

    return (
        <AccordionItem
            header={<Header form={form} index={index} />}
            value={field.id}
            key={field.id}
            className="border mb-3 rounded-sm"
        >
            <div className="p-4 pt-0">
                <section className="mb-4 grid grid-cols-2 gap-3 rounded-md">
                    <input type="hidden" {...register(`education.${index}.id`)} />
                    <input type="hidden" {...register(`education.${index}.user_id`)} />
                    <Input
                        autoFocus={autofocus}
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
                    <Controller
                        name={`education.${index}.start_date`}
                        control={form.control}
                        rules={{ validate, required: true }}
                        render={({ field }) => {
                            const value = field.value ? new Date(field.value) : undefined
                            return (
                                <DatePicker
                                    hint={<ErrorHint>{fieldErrs.start_date?.message}</ErrorHint>}
                                    mode="single"
                                    label="Start Date"
                                    selected={value}
                                    onChange={val => field.onChange(val)}
                                />
                            )
                        }}
                    />
                    <Controller
                        name={`education.${index}.still_studying_here`}
                        control={form.control}
                        render={({ field: item }) => (
                            <div className="flex items-center gap-1">
                                <Checkbox
                                    id="followUp"
                                    checked={item.value ?? false}
                                    onCheckedChange={val => item.onChange(val)}
                                />
                                <Label htmlFor="followUp">Would you be open to a short chat?</Label>
                            </div>
                        )}
                    />

                    <Controller
                        name={`education.${index}.end_date`}
                        control={form.control}
                        rules={{ validate, required: true, }}
                        render={({ field }) => {
                            const value = field.value ? new Date(field.value) : undefined
                            return (
                                <DatePicker
                                    hint={<ErrorHint>{fieldErrs.end_date?.message}</ErrorHint>}
                                    mode="single"
                                    label="End Date"
                                    selected={value}
                                    onChange={val => field.onChange(val)}
                                />
                            )
                        }}
                    />
                </section>

                <section className="mb-4">
                    <Controller
                        name={`education.${index}.highlights`}
                        control={form.control}
                        render={({ field }) => (
                            <Editor
                                value={field.value ?? ''}
                                label="Highlights"
                                onChange={text => field.onChange(text)}
                            />
                        )}
                    />
                </section>

                <HighlightFooter onDeleteClick={() => onDeleteClick(field, index)} />
            </div>
        </AccordionItem>
    )
}