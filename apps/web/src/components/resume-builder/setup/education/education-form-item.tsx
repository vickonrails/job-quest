import { Accordion, AccordionItem } from '@components/accordion'
import { Checkbox } from '@components/checkbox'
import { AccordionExpandIcon } from '@components/resume-builder/accordion-expand-icon'
import { DateRenderer } from '@components/resume-builder/date-renderer'
import { type Education, type Highlight } from '@lib/types'
import { type Dispatch, type SetStateAction } from 'react'
import { Controller, useFieldArray, useWatch, type FieldArrayWithId, type UseFormReturn } from 'react-hook-form'
import { Input, Textarea } from 'ui'
import { ErrorHint } from '../components/error-hint'
import { HighlightFooter } from '../components/highlights-footer'
import { v4 as uuid } from 'uuid'

export interface BaseFormItemProps {
    autofocus?: boolean
    defaultOpen?: boolean
}

interface EducationFormProps extends BaseFormItemProps {
    form: UseFormReturn<{ education: Education[] }, 'education'>
    fields: FieldArrayWithId<{ education: Education[] }, 'education', '_id'>[],
    onDeleteClick: (education: Education, index: number) => void
    setHighlightsToDelete?: Dispatch<SetStateAction<string[]>>
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

export function EducationForm({ form, onDeleteClick, fields, setHighlightsToDelete, defaultOpen, ...rest }: EducationFormProps) {
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
                    setHighlightsToDelete={setHighlightsToDelete}
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
    setHighlightsToDelete?: Dispatch<SetStateAction<string[]>>
}

function FormItem({ form, index, field, onDeleteClick, setHighlightsToDelete, autofocus }: FormItemProps) {
    const { register } = form
    const fieldErrs = form.formState.errors?.education?.[index] ?? {}

    return (
        <AccordionItem
            header={<Header form={form} index={index} />}
            value={field.id}
            key={field.id}
            className="border bg-white mb-3 rounded-sm"
        >
            <div className="p-4 pt-0">
                <section className="mb-4 grid grid-cols-2 gap-3 rounded-md">
                    <input type="hidden" {...register(`education.${index}.id`)} />
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

                <EducationHighlights
                    form={form}
                    index={index}
                    entity={field}
                    onDeleteClick={() => onDeleteClick(field, index)}
                    setHighlightsToDelete={setHighlightsToDelete}
                />
            </div>
        </AccordionItem>
    )
}

interface HighlightsProps {
    form: UseFormReturn<{ education: Education[] }>
    index: number,
    onDeleteClick: () => void
    entity: Education
    setHighlightsToDelete?: Dispatch<SetStateAction<string[]>>
}

export function EducationHighlights({ form, index, onDeleteClick, entity, setHighlightsToDelete }: HighlightsProps) {
    const { fields, remove, append } = useFieldArray({ name: `education.${index}.highlights`, control: form.control, keyName: '_id' })

    const handleRemove = (idx: number) => {
        const highlight = fields[idx]
        if (highlight?.id) {
            setHighlightsToDelete?.((prev) => [...prev, highlight.id])
        }
        remove(idx)
    }

    return (
        <>
            <section className="mb-4">
                {fields.map((field, idx) => (
                    <section key={field._id} className="mb-2 flex flex-col items-end">
                        <Textarea
                            placeholder="A summary of what you did in this role"
                            label={idx === 0 ? 'Highlights' : ''}
                            containerClasses="w-full mb-1"
                            rows={2}
                            {...form.register(`education.${index}.highlights.${idx}.text`)}
                        />
                        <button className="text-xs" onClick={() => handleRemove(idx)}>Remove</button>
                    </section>
                ))}
            </section>

            <HighlightFooter
                onDeleteClick={onDeleteClick}
                addHighlight={() => append(getDefaultEntity(entity.id))}
            />
        </>
    )
}

function getDefaultEntity(id: string): Highlight {
    return {
        text: '',
        education_id: id,
        id: uuid(),
        type: 'education'
    } as unknown as Highlight
} 