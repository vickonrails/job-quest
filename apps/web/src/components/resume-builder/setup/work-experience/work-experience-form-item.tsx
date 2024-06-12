import { Accordion, AccordionItem } from '@/components/accordion'
import { AccordionExpandIcon } from '@/components/resume-builder/accordion-expand-icon'
import { DateRenderer } from '@/components/resume-builder/date-renderer'
import { TipTap } from '@/components/tiptap'
import { isAfter } from 'date-fns'
import { type WorkExperience } from 'lib/types'
import { useCallback, type Dispatch, type SetStateAction } from 'react'
import { Controller, useWatch, type FieldArrayWithId, type UseFormReturn } from 'react-hook-form'
import { DatePicker } from 'ui/date-picker'
import { Input } from 'ui/input'
import { ErrorHint } from '../components/error-hint'
import { type BaseFormItemProps } from '../education/education-form-item'
import { HighlightFooter } from '../components/highlights-footer'

interface WorkExperienceFormProps extends BaseFormItemProps {
    form: UseFormReturn<{ workExperience: WorkExperience[] }, 'workExperience'>
    fields: FieldArrayWithId<{ workExperience: WorkExperience[] }, 'workExperience', '_id'>[],
    onDeleteClick: (experience: WorkExperience, index: number) => void
    // onHighlightDelete: Dispatch<SetStateAction<string[]>>
}

/** ------------------ Work Experience Form ------------------ */
export function WorkExperienceForm({ form, fields, onDeleteClick, defaultOpen, ...rest }: WorkExperienceFormProps) {
    const isDefaultOpen = defaultOpen ? (fields[0]?.id ?? '') : ''
    return (
        <Accordion type="single" collapsible defaultValue={isDefaultOpen}>
            {fields.map((field, index) => (
                <FormItem
                    form={form}
                    key={field.id}
                    index={index}
                    onDeleteClick={onDeleteClick}
                    field={field}
                    {...rest}
                />
            ))}
        </Accordion>
    )
}

interface FormItemProps extends BaseFormItemProps {
    form: UseFormReturn<{ workExperience: WorkExperience[] }>
    index: number,
    field: FieldArrayWithId<{ workExperience: WorkExperience[] }, 'workExperience', '_id'>,
    onDeleteClick: (experience: WorkExperience, index: number) => void
    onHighlightDelete?: Dispatch<SetStateAction<string[]>>
}

function FormItem({ form, index, onDeleteClick, field, autofocus }: FormItemProps) {
    const { register, formState: { errors } } = form
    const fieldErrs = errors?.workExperience?.[index] ?? {}

    // TODO: memoize
    const validate = useCallback(() => {
        form.clearErrors()
        const [start_date, end_date] = form.getValues([
            `workExperience.${index}.start_date`,
            `workExperience.${index}.end_date`
        ])

        if (!start_date || !end_date) return;

        const startDate = new Date(start_date)
        const endDate = new Date(end_date)

        const invalidDuration = isAfter(startDate, endDate)

        if (invalidDuration) {
            form.setError(`workExperience.${index}.end_date`, {
                message: 'End date cannot be earlier than start date'
            })
            form.setError(`workExperience.${index}.start_date`, {
                message: 'Start date cannot be later than end date'
            })
            return false;
        }

        return true
    }, [form, index])

    return (
        <AccordionItem
            header={<Header form={form} index={index} />}
            value={field.id}
            key={field.id}
            className="border mb-2"
        >
            <div className="p-4 pt-0">
                <section className="grid grid-cols-2 gap-3 mb-4 rounded-md">
                    <input type="hidden" {...register(`workExperience.${index}.id`)} />
                    <input type="hidden" {...register(`workExperience.${index}.user_id`)} />
                    <Input
                        autoFocus={autofocus}
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

                    <Controller
                        control={form.control}
                        name={`workExperience.${index}.start_date`}
                        rules={{ validate }}
                        render={({ field }) => {
                            const value = field.value ? new Date(field.value) : undefined
                            return (
                                <DatePicker
                                    mode="single"
                                    label="Start Date"
                                    hint={<ErrorHint>{fieldErrs.start_date?.message}</ErrorHint>}
                                    onChange={(x) => field.onChange(x)}
                                    selected={value}
                                />
                            )
                        }}
                    />

                    <Controller
                        name={`workExperience.${index}.end_date`}
                        control={form.control}
                        rules={{ validate }}
                        render={({ field }) => {
                            const value = field.value ? new Date(field.value) : undefined
                            return (
                                <DatePicker
                                    mode="single"
                                    hint={<ErrorHint>{fieldErrs.end_date?.message}</ErrorHint>}
                                    label="End Date"
                                    onChange={(x) => field.onChange(x)}
                                    selected={value}
                                />
                            )
                        }}
                    />
                </section>

                <Controller
                    name={`workExperience.${index}.highlights`}
                    control={form.control}
                    render={({ field }) => (
                        <TipTap
                            value={field.value ?? ''}
                            label="Highlights"
                            onChange={text => field.onChange(text)}
                        />
                    )}
                />

                <HighlightFooter onDeleteClick={() => onDeleteClick(field, index)} />
            </div>
        </AccordionItem>
    )
}

/** ------------------ Work Experience Header ------------------ */
function Header({ form, index }: { form: UseFormReturn<{ workExperience: WorkExperience[] }, 'workExperience'>, index: number }) {
    const experience = useWatch({ control: form.control, name: `workExperience.${index}` })
    const { start_date, job_title, end_date, company_name } = experience

    return (
        <header className="flex items-start justify-between group cursor-pointer hover:text-primary w-full p-4">
            <div>
                <p className="flex gap-2 select-none text-accent-foreground font-medium">{job_title || 'Untitled...'}</p>
                <span className="text-sm text-muted-foreground">{company_name || 'Untitled...'}
                    <DateRenderer startDate={start_date} endDate={end_date ?? ''} />
                </span>
            </div>

            <AccordionExpandIcon />
        </header>
    )
}