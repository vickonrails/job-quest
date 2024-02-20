import { Accordion } from '@components/accordion'
import { Checkbox } from '@components/checkbox'
import { AccordionExpandIcon } from '@components/resume-builder/accordion-expand-icon'
import { DateRenderer } from '@components/resume-builder/date-renderer'
import { type WorkExperience } from '@lib/types'
import { Controller, useWatch, type FieldArrayWithId, type UseFormReturn } from 'react-hook-form'
import { Input } from 'ui'
import { ErrorHint } from '../components/error-hint'
import { WorkExperienceHighlights } from './work-experience-highlights'

interface WorkExperienceFormProps {
    form: UseFormReturn<{ workExperience: WorkExperience[] }>
    index: number,
    field: FieldArrayWithId<{ workExperience: WorkExperience[] }>,
    onDeleteClick: (experience: WorkExperience, index: number) => void
}

/** ------------------ Accordion Header ------------------ */
function Header({ experience }: { experience: WorkExperience }) {
    const { start_date, job_title, end_date, company_name } = experience

    return (
        <header className="flex items-start justify-between group cursor-pointer hover:text-primary w-full p-4">
            <div>
                <p className="flex gap-2 select-none font-medium">{job_title}</p>
                <span className="text-sm text-muted-foreground">{company_name}
                    <DateRenderer startDate={start_date} endDate={end_date ?? ''} />
                </span>
            </div>

            <AccordionExpandIcon />
        </header>
    )
}


/** ------------------ Work Experience Form ------------------ */
export function WorkExperienceForm({ form, index, onDeleteClick }: WorkExperienceFormProps) {
    const { register, formState: { errors }, control } = form
    const fieldErrs = errors?.workExperience?.[index] ?? {}
    const experience = useWatch({ control, name: `workExperience.${index}` })

    return (
        <section className="border bg-white mb-2">
            <Accordion header={(
                <Header experience={experience} />
            )}>
                <div className="p-4 pt-0">
                    <section className="grid grid-cols-2 gap-3 mb-4 rounded-md">
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
                                    id={`${experience.job_title ?? ''}-${experience.company_name ?? ''}-still-working-here`}
                                    label="I'm Still Working Here?"
                                    checked={item.value ?? false}
                                    onCheckedChange={val => item.onChange(val)}
                                    className="h-[84px]"
                                />
                            )}
                        />

                        {!experience.still_working_here && (
                            <Input
                                type="date"
                                label="End Date"
                                placeholder="End Date..."
                                hint={<ErrorHint>{fieldErrs.end_date?.message}</ErrorHint>}
                                disabled={Boolean(experience.still_working_here)}
                                {...register(`workExperience.${index}.end_date`, { required: { message: 'End date is required', value: true } })}
                            />
                        )}
                    </section>

                    <WorkExperienceHighlights
                        form={form}
                        index={index}
                        entity={experience}
                        onDeleteClick={() => onDeleteClick(experience, index)}
                    />
                </div>
            </Accordion>
        </section>
    )
}