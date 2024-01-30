import { useToast } from '@components/toast/use-toast';
import { type Database } from '@lib/database.types';
import { useSupabaseClient, type Session } from '@supabase/auth-helpers-react';
import { ChevronLeft, Plus, Save } from 'lucide-react';
import { useRouter } from 'next/router';
import { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button, type ButtonProps } from 'ui';
import { v4 as uuid } from 'uuid';
import { type FormValues } from '../../../../pages/resumes/[resume]';
import { BasicInfoSection } from './resume-basic-info';
import { EducationSection } from './resume-education';
import { WorkExperienceSection } from './resume-experience';
import { ProjectsSection } from './resume-projects';

export function ResumeForm({ session }: { session: Session }) {
    const client = useSupabaseClient<Database>()
    const form = useFormContext<FormValues>();
    const router = useRouter()
    const { formState } = form
    const { toast } = useToast()

    const onSubmit = async ({ resume, workExperience, projects, education }: FormValues) => {
        // TODO: I might need to refetch the whole resume after updating...
        const resumeUpdatePromise = client.from('resumes').upsert(resume);
        // TODO: abstract away this logic
        const preparedWorkExperience = workExperience.map((experience) => {
            if (!experience.id) {
                experience.user_id = session.user.id;
                experience.resume_id = resume.id;
                experience.id = uuid();
            }
            if ((experience.still_working_here && experience.end_date) || !experience.end_date) {
                experience.end_date = null
            }
            return experience
        });

        const preparedProjects = projects.map((project) => {
            if (!project.id) {
                project.user_id = session.user.id;
                project.resume_id = resume.id;
                project.id = uuid();
            }
            return project
        })

        const preparedEducation = education.map((education) => {
            if (!education.id) {
                education.user_id = session.user.id;
                education.resume_id = resume.id;
                education.id = uuid();
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
            resumeUpdatePromise,
            workExperienceUpdatePromise,
            projectUpdatePromise,
            educationUpdatePromise
        ]);

        if (promiseResult.some((res) => res.error)) {
            toast({
                title: 'An error occured',
                variant: 'destructive'
            })
        } else {
            toast({
                title: 'Resume saved',
                variant: 'success'
            })
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2 border-r p-6 flex-shrink-0 mx-auto">
            <section className="max-w-xl mx-auto">
                <Button variant="link" type="button" className="pl-0" onClick={() => router.back()}>
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
                <Button loading={formState.isSubmitting} type="submit" className="flex items-center gap-1">
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