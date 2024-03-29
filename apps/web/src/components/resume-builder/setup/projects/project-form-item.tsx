import { Accordion, AccordionItem } from '@components/accordion'
import { Chip } from '@components/chips'
import { AccordionExpandIcon } from '@components/resume-builder/accordion-expand-icon'
import { formatDate } from '@components/utils'
import { type Project } from '@lib/types'
import { Trash2 } from 'lucide-react'
import { createRef, useEffect, useState, type ChangeEvent } from 'react'
import { useFieldArray, useWatch, type FieldArrayWithId, type UseFormReturn } from 'react-hook-form'
import { Button, Input, Textarea } from 'ui'
import { ErrorHint } from '../components/error-hint'
import { type BaseFormItemProps } from '../education/education-form-item'

interface ProjectsFieldsProps extends BaseFormItemProps {
    form: UseFormReturn<{ projects: Project[] }, 'projects'>
    fields: FieldArrayWithId<{ projects: Project[] }, 'projects', '_id'>[],
    onDeleteClick: (project: Project, index: number) => void
}

/** ------------------ Work Experience Header ------------------ */
function Header({ form, index }: { form: UseFormReturn<{ projects: Project[] }, 'projects'>, index: number }) {
    const project = useWatch({ control: form.control, name: `projects.${index}` })
    const { start_date, title } = project

    return (
        <header className="flex items-start justify-between group cursor-pointer hover:text-primary w-full p-4">
            <div>
                <p className="flex gap-2 select-none font-medium">{title || 'Untitled...'}</p>
                {start_date && (
                    <span className="text-sm text-muted-foreground">
                        {formatDate(start_date)}
                    </span>
                )}
            </div>

            <AccordionExpandIcon />
        </header>
    )
}

export function ProjectForm({ form, fields, onDeleteClick, defaultOpen, ...rest }: ProjectsFieldsProps) {
    const isDefaultOpen = defaultOpen ? (fields[0]?.id ?? '') : ''
    return (
        <Accordion type="single" collapsible defaultValue={isDefaultOpen}>
            {fields.map((field, index) => (
                <FormItem
                    key={field.id}
                    form={form}
                    onDeleteClick={onDeleteClick}
                    field={field}
                    index={index}
                    {...rest}
                />
            ))}
        </Accordion >
    )
}

interface FormItemProps extends BaseFormItemProps {
    form: UseFormReturn<{ projects: Project[] }>
    index: number,
    field: FieldArrayWithId<{ projects: Project[] }, 'projects', '_id'>,
    onDeleteClick: (projects: Project, index: number) => void
}

function FormItem({ form, field, index, onDeleteClick, autofocus }: FormItemProps) {
    const { register, } = form
    const fieldErrs = form.formState.errors?.projects?.[index] ?? {}

    return (
        <AccordionItem
            header={<Header form={form} index={index} />}
            key={field._id}
            value={field.id}
            className="border bg-white mb-2"
        >
            <div className="p-4 pt-0">
                <section className="mb-4 grid grid-cols-2 gap-3 rounded-md">
                    <Input
                        autoFocus={autofocus}
                        label="Project Title..."
                        placeholder="Title"
                        hint={<ErrorHint>{fieldErrs.title?.message}</ErrorHint>}
                        {...register(`projects.${index}.title`, { required: { message: 'Project title is required', value: true } })}
                    />
                    <Input
                        label="URL"
                        type="url"
                        placeholder="Link to Demo..."
                        hint={<ErrorHint>{fieldErrs.url?.message}</ErrorHint>}
                        {...register(`projects.${index}.url`, { required: { message: 'URL is required', value: true } })}
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

                    <Textarea
                        label="Description"
                        containerClasses="col-span-2 w-full"
                        // className='col-span-2 w-full'
                        placeholder="A brief description of the project..."
                        {...register(`projects.${index}.description`)}
                    />
                </section>

                <ProjectSkills index={index} form={form} />

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
        </AccordionItem>
    )
}

// ---------------------- Project Skills ---------------------- //

function ProjectSkills({ index, form }: { index: number, form: UseFormReturn<{ projects: Project[] }> }) {
    const [skill, setSkill] = useState<string>('')
    const { fields, remove, append } = useFieldArray({
        name: `projects.${index}.skills`,
        control: form.control,
        keyName: '_id'
    })

    const inputRef = createRef<HTMLInputElement>()

    // TODO: optimize this block
    useEffect(() => {
        const input = inputRef.current;
        const handler = (ev: KeyboardEvent) => {
            if (!skill) return
            if (ev.key === 'Enter') {
                append({ label: skill })
                setSkill('')
            }
        }
        input?.addEventListener('keypress', handler);
        return () => {
            input?.removeEventListener('keypress', handler);
        }
    }, [append, inputRef, skill])

    return (
        <section className="mb-4">
            <Input
                placeholder='Press "Enter" to add a skill'
                className="mb-4"
                label="Skills Required (Press Enter to add)"
                value={skill}
                onChange={(ev: ChangeEvent<HTMLInputElement>) => setSkill(ev.target.value)}
                ref={inputRef}
            />
            {fields.map((field, idx) => (
                <Chip key={field._id} label={field.label} onCloseClick={() => remove(idx)} />
            ))}
        </section>
    )
}