import BackButton from '@components/back-button';
import { Chip } from '@components/chips';
import { DevTool } from '@hookform/devtools';
import { type Session } from '@supabase/auth-helpers-react';
import { ChevronDown, Save } from 'lucide-react';
import { useRouter } from 'next/router';
import { createRef, forwardRef, memo, useEffect, useState } from 'react';
import { useFieldArray, useFormContext, type UseFormReturn } from 'react-hook-form';
import { Button, Input, type ButtonProps } from 'ui';
import { type FormValues } from '../../../../pages/resumes/[resume]';
import { BasicInfoSection } from './resume-basic-info';
import { EducationSection } from './resume-education';
import { WorkExperienceSection } from './resume-experience';
import { ProjectsSection } from './resume-projects';

export const ResumeForm = memo(({ session }: { session: Session }) => {
    const form = useFormContext<FormValues>();
    const router = useRouter()
    const formRef = createRef<HTMLFormElement>()

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
                <WorkExperienceSection session={session} />
                <ProjectsSection session={session} />
                <EducationSection session={session} />
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