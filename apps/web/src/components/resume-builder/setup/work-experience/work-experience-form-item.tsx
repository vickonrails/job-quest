import { Accordion, AccordionItem } from '@components/accordion'
import { DatePicker } from '@components/date-picker'
import { AccordionExpandIcon } from '@components/resume-builder/accordion-expand-icon'
import { DateRenderer } from '@components/resume-builder/date-renderer'
import { type WorkExperience } from '@lib/types'
import { isValid } from 'date-fns'
import { type Dispatch, type SetStateAction } from 'react'
import { Controller, type ControllerRenderProps, useWatch, type FieldArrayWithId, type UseFormReturn } from 'react-hook-form'
import { Input } from 'ui'
import { ErrorHint } from '../components/error-hint'
import { type BaseFormItemProps } from '../education/education-form-item'
import { WorkExperienceHighlights } from './work-experience-highlights'
import { Checkbox } from '@components/checkbox'

interface WorkExperienceFormProps extends BaseFormItemProps {
    form: UseFormReturn<{ workExperience: WorkExperience[] }, 'workExperience'>
    fields: FieldArrayWithId<{ workExperience: WorkExperience[] }, 'workExperience', '_id'>[],
    onDeleteClick: (experience: WorkExperience, index: number) => void
    onHighlightDelete: Dispatch<SetStateAction<string[]>>
}

/** ------------------ Work Experience Form ------------------ */
export function WorkExperienceForm({ form, fields, onDeleteClick, onHighlightDelete, defaultOpen, ...rest }: WorkExperienceFormProps) {
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
                    onHighlightDelete={onHighlightDelete}
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

/** ------------------ Work Experience Form Item ------------------ */
function FormItem({ form, index, onDeleteClick, field, onHighlightDelete, autofocus }: FormItemProps) {
    const { register, watch } = form
    const fieldErrs = form.formState.errors?.workExperience?.[index] ?? {}
    const still_working_here = watch(`workExperience.${index}.still_working_here`)

    return (
        <AccordionItem
            header={<Header form={form} index={index} />}
            value={field.id}
            key={field.id}
            className="border bg-white mb-2"
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
                        render={({ field }) => <DatePickerFormControl label="End Date (DD-MM-YYYY)" field={field} />}
                    />

                    <Controller
                        name={`workExperience.${index}.still_working_here`}
                        control={form.control}
                        render={({ field: item }) => (
                            <Checkbox
                                id={`${field.job_title ?? ''}-${field.company_name ?? ''}-still-working-here`}
                                label="I'm Still Working Here?"
                                checked={item.value ?? false}
                                onCheckedChange={val => item.onChange(val)}
                                className="h-[84px]"
                            />
                        )}
                    />

                    {!still_working_here && (
                        <Controller
                            control={form.control}
                            name={`workExperience.${index}.end_date`}
                            rules={{ validate: value => isValid(value) || 'Please enter a valid number' }}
                            render={({ field }) => <DatePickerFormControl label="End Date (DD-MM-YYYY)" field={field} />}
                        />
                    )}
                </section>

                <WorkExperienceHighlights
                    form={form}
                    index={index}
                    entity={field}
                    onDeleteClick={() => onDeleteClick(field, index)}
                    onHighlightDelete={onHighlightDelete}
                />
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
                <p className="flex gap-2 select-none font-medium">{job_title || 'Untitled...'}</p>
                <span className="text-sm text-muted-foreground">{company_name || 'Untitled...'}
                    <DateRenderer startDate={start_date} endDate={end_date ?? ''} />
                </span>
            </div>

            <AccordionExpandIcon />
        </header>
    )
}

type DatePickerFormControlProps = ControllerRenderProps<{
    workExperience: WorkExperience[];
}, `workExperience.${number}.end_date` | `workExperience.${number}.start_date`>

function DatePickerFormControl({ field, label }: { field: DatePickerFormControlProps, label: string }) {
    const { value } = field
    return (
        <DatePicker
            placeholder="Select a date"
            // hint={<ErrorHint>{fieldErrs.end_date?.message}</ErrorHint>}
            label={label}
            onChange={(x) => field.onChange(x)}
            value={value ? new Date(value) : undefined}
        />
    )
}