import { Accordion, AccordionItem } from '@components/accordion'
import { Checkbox } from '@components/checkbox'
import { AccordionExpandIcon } from '@components/resume-builder/accordion-expand-icon'
import { DateRenderer } from '@components/resume-builder/date-renderer'
import { type WorkExperience } from '@lib/types'
import { type Dispatch, type SetStateAction } from 'react'
import { Controller, useWatch, type FieldArrayWithId, type UseFormReturn } from 'react-hook-form'
import { Input } from 'ui'
import { ErrorHint } from '../components/error-hint'
import { WorkExperienceHighlights } from './work-experience-highlights'

interface WorkExperienceFormProps {
    form: UseFormReturn<{ workExperience: WorkExperience[] }, 'workExperience'>
    fields: FieldArrayWithId<{ workExperience: WorkExperience[] }, 'workExperience', '_id'>[],
    onDeleteClick: (experience: WorkExperience, index: number) => void
    onHighlightDelete: Dispatch<SetStateAction<string[]>>
}

/** ------------------ Work Experience Form ------------------ */
export function WorkExperienceForm({ form, fields, onDeleteClick, onHighlightDelete }: WorkExperienceFormProps) {
    return (
        <Accordion type="single" collapsible defaultValue={fields[0]?.id ?? ''}>
            {fields.map((field, index) => (
                <FormItem
                    form={form}
                    key={field.id}
                    index={index}
                    onDeleteClick={onDeleteClick}
                    field={field}
                    onHighlightDelete={onHighlightDelete}
                />
            ))}
        </Accordion>
    )
}

interface FormItemProps {
    form: UseFormReturn<{ workExperience: WorkExperience[] }>
    index: number,
    field: FieldArrayWithId<{ workExperience: WorkExperience[] }, 'workExperience', '_id'>,
    onDeleteClick: (experience: WorkExperience, index: number) => void
    onHighlightDelete?: Dispatch<SetStateAction<string[]>>
}

/** ------------------ Work Experience Form Item ------------------ */
function FormItem({ form, index, onDeleteClick, field, onHighlightDelete }: FormItemProps) {
    const { register, formState: { errors } } = form
    const fieldErrs = errors?.workExperience?.[index] ?? {}

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
                    <Input
                        autoFocus
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
                                id={`${field.job_title ?? ''}-${field.company_name ?? ''}-still-working-here`}
                                label="I'm Still Working Here?"
                                checked={item.value ?? false}
                                onCheckedChange={val => item.onChange(val)}
                                className="h-[84px]"
                            />
                        )}
                    />

                    {!field.still_working_here && (
                        <Input
                            type="date"
                            label="End Date"
                            placeholder="End Date..."
                            hint={<ErrorHint>{fieldErrs.end_date?.message}</ErrorHint>}
                            disabled={Boolean(field.still_working_here)}
                            {...register(`workExperience.${index}.end_date`, { required: { message: 'End date is required', value: true } })}
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