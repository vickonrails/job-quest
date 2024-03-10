import BackButton from '@components/back-button';
import { Chip } from '@components/chips';
import { type Database } from '@lib/database.types';
import { type Highlight } from '@lib/types';
import { useSupabaseClient, type Session } from '@supabase/auth-helpers-react';
import { ChevronDown, Save } from 'lucide-react';
import { useRouter } from 'next/router';
import { createRef, forwardRef, memo, useCallback, useEffect, useState } from 'react';
import { useFieldArray, useFormContext, useWatch, type UseFormReturn } from 'react-hook-form';
import { Button, Input, type ButtonProps } from 'ui';
import { v4 as uuid } from 'uuid';
import { type FormValues } from '../../../../pages/resumes/[resume]';
import { BasicInfoSection } from './resume-basic-info';
import { EducationSection } from './resume-education';
import { WorkExperienceSection } from './resume-experience';
import { ProjectsSection } from './resume-projects';
import { debounce } from '@utils/debounce';
import { DevTool } from '@hookform/devtools'
import useDeepCompareEffect from 'use-deep-compare-effect';

function useDebouncedSubmit() {
    const router = useRouter();
    const client = useSupabaseClient<Database>()
    // const { toast } = useToast()

    const save = async (values: FormValues) => {
        const { resume, workExperience, projects, education } = values
        const highlights: Highlight[] = []
        resume.id = router.query.resume as string;
        const { error } = await client.from('resumes').upsert(resume);
        if (error) throw error;

        const preparedWorkExperience = workExperience.map((experience) => {
            experience.resume_id = resume.id;
            if (!experience.id) {
                experience.id = uuid();
            }

            if (experience.highlights) {
                highlights.push(...experience.highlights);
                delete experience.highlights;
            }

            if ((experience.still_working_here && experience.end_date) || !experience.end_date) {
                experience.end_date = null
            }
            return experience
        });

        const preparedProjects = projects.map((project) => {
            project.resume_id = resume.id;
            if (!project.id) {
                project.id = uuid();
            }
            return project
        })

        const preparedEducation = education.map((education) => {
            education.resume_id = resume.id;

            if (!education.id) {
                education.id = uuid();
            }
            if (education.highlights) {
                highlights.push(...education.highlights)
                delete education.highlights
            }
            if ((education.still_studying_here && education.end_date) || !education.end_date) {
                education.end_date = null
            }
            return education
        })

        const educationUpdatePromise = client.from('education').upsert(preparedEducation);
        const workExperienceUpdatePromise = client.from('work_experience').upsert(preparedWorkExperience);
        const projectUpdatePromise = client.from('projects').upsert(preparedProjects);
        const promiseResult = await Promise.all([
            workExperienceUpdatePromise,
            projectUpdatePromise,
            educationUpdatePromise
        ]);

        // const hasErrors = promiseResult.some((res) => res.error)

        // if (!hasErrors) {

        //     if (highlightsToDelete.length > 0) {
        //         const result = await client.from('highlights').delete().in('id', highlightsToDelete);
        //         if (result.error) throw new Error(result.error.message)
        //     }

        //     const preparedHighlights = highlights.filter(x => !highlightsToDelete.includes(x.id)).map(highlight => setEntityId<Highlight>(highlight, { overwrite: false }))
        //     const { error } = await client.from('highlights').upsert(preparedHighlights).select();
        //     if (error) throw new Error(error.message);
        //     toast({
        //         title: 'Resume saved',
        //         variant: 'success'
        //     })
        // } else {
        //     toast({
        //         title: 'An error occured',
        //         variant: 'destructive'
        //     })
        // }
    }

    return { save }
}

export const ResumeForm = memo(({ session, defaultValues }: { session: Session, defaultValues: FormValues }) => {
    const form = useFormContext<FormValues>();
    const router = useRouter()
    const { formState: { isDirty } } = form
    const formRef = createRef<HTMLFormElement>()
    const { save } = useDebouncedSubmit()
    const [highlightsToDelete, setHighlightsToDelete] = useState<string[]>([])

    const watchedData = useWatch({
        control: form.control,
        defaultValue: defaultValues
    });

    useEffect(() => {
        const form = formRef.current;
        const handler = (ev: KeyboardEvent) => {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                return;
            }
        }

        form?.addEventListener('keypress', handler);
        return () => {
            form?.removeEventListener('keypress', handler)
        }
    }, [formRef])

    const log = useCallback(
        debounce(async () => {
            await form.handleSubmit(save)()
        }, 3000),
        []
    )

    useDeepCompareEffect(() => {
        if (!isDirty) return
        log().then(() => {
            // 
        }).catch(() => {
            // 
        })
    }, [watchedData])

    return (
        <form className="w-1/2 border-r p-6 flex-shrink-0 mx-auto overflow-auto" ref={formRef}>
            <section className="max-w-xl mx-auto">
                <BackButton onClick={() => router.back()} />
                <header>
                    <h3 className="font-medium text-lg">Personal Information</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Provide your full name, professional title, and a brief overview of your personal profile. This section is your first impression, so make it count.
                    </p>
                </header>

                {/* TODO: use context to avoid passing session to every component */}
                <BasicInfoSection />
                <WorkExperienceSection session={session} onHighlightDelete={setHighlightsToDelete} />
                <ProjectsSection session={session} />
                <EducationSection session={session} onHighlightDelete={setHighlightsToDelete} />
                <Skills />
                <Button type="submit" className="flex items-center gap-1">
                    <Save size={18} />
                    <span>Save</span>
                </Button>
                <DevTool control={form.control} />
            </section>
        </form>
    )
})

ResumeForm.displayName = 'ResumeForm'

function Skills() {
    const form = useFormContext<FormValues>();
    return (
        <section className="mb-4">
            <h3 className="font-medium text-lg">Skills</h3>
            <p className="mb-4 text-sm text-muted-foreground">List relevant skills that match this job description.</p>
            <SkillsForm form={form} />
        </section>
    )
}

// TODO: refactor to use SkillsForm from profile setup
export function SkillsForm({ form }: { form: UseFormReturn<FormValues> }) {
    const [skillValue, setSkillValue] = useState<string>('')
    const inputRef = createRef<HTMLInputElement>()

    const { append, fields, remove } = useFieldArray({
        name: 'resume.skills',
        control: form.control,
        keyName: '_id'
    });

    useEffect(() => {
        const input = inputRef.current;
        const handler = (ev: KeyboardEvent) => {
            if (!skillValue) return
            if (ev.key === 'Enter') {
                append({ label: skillValue })
                setSkillValue('')
            }
        }
        input?.addEventListener('keypress', handler);
        return () => {
            input?.removeEventListener('keypress', handler);
        }
    }, [append, inputRef, skillValue])

    return (
        <section className="mb-4 rounded-md">
            <Input
                label="Relevant Skills (Press Enter to add)"
                className="mb-4"
                value={skillValue}
                onChange={ev => setSkillValue(ev.target.value)}
                placeholder="Press Enter to add skill"
                ref={inputRef}
            />
            {fields.map((field, idx) => (
                <Chip key={field._id} label={field.label} onCloseClick={() => remove(idx)} />
            ))}
        </section>
    )
}


/**
 * Button to add new sections
 */
export const AddSectionBtn = forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...props }, ref) => {
    return (
        <Button type="button" variant="ghost" {...props} ref={ref}>
            <span className="text-sm text-primary hover:text-primary">{children}</span>
            <ChevronDown size={16} />
        </Button>
    )
})
AddSectionBtn.displayName = 'AddSectionBtn'