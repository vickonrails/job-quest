import { type Database } from '@lib/database.types';
import { useSupabaseClient, type Session } from '@supabase/auth-helpers-react';
import { ChevronLeft, Plus, Save } from 'lucide-react';
import { useRouter } from 'next/router';
import { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button, type ButtonProps } from 'ui';
import { type FormValues } from '../../../../pages/resumes/[resume]';
import { BasicInfoSection } from './resume-basic-info';
import { EducationSection } from './resume-education';
import { WorkExperienceSection } from './resume-experience';
import { ProjectsSection } from './resume-projects';

export function ResumeForm({ session }: { session: Session }) {
    const client = useSupabaseClient<Database>()
    const form = useFormContext<FormValues>();
    const router = useRouter()
    const { formState: { isSubmitting } } = form

    const onSubmit = async ({ resume }: FormValues) => {
        const isNew = !resume.id
        if (!session) return
        const newResume = {
            ...resume,
            user_id: session.user.id
        }
        if (isNew) newResume.id = router.query.resume as string;
        await client.from('resumes').insert(newResume).select();
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2 border-r p-6 flex-shrink-0 mx-auto">
            <section className="max-w-xl mx-auto">
                <Button variant="link" className="pl-0" onClick={() => router.back()}>
                    <ChevronLeft />
                    <span>Back</span>
                </Button>

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
                <Button loading={isSubmitting} className="flex items-center gap-1">
                    <Save size={18} />
                    <span>Save</span>
                </Button>
            </section>
        </form>
    )
}


/**
 * Button to add new sections
 */
export const AddSectionBtn = forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...props }, ref) => {
    return (
        <Button type="button" variant="ghost" {...props} ref={ref}>
            <Plus size={18} />
            <span className="text-sm">{children}</span>
        </Button>
    )
})
AddSectionBtn.displayName = 'AddSectionBtn'