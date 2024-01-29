import { MenuBar, MenuItem } from '@components/menubar';
import { EducationForm } from '@components/resume-builder/setup/education/education-form-item';
import { ProjectForm } from '@components/resume-builder/setup/projects/project-form-item';
import { WorkExperienceForm } from '@components/resume-builder/setup/work-experience/work-experience-form-item';
import { Textarea } from '@components/textarea';
import { formatDate } from '@components/utils';
import { type Database } from '@lib/database.types';
import { type Resume, type Education, type Project, type WorkExperience } from '@lib/types';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Plus, Save } from 'lucide-react';
import { useRouter } from 'next/router';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button, Input, type ButtonProps } from 'ui';
import { type FormValues } from '../../../../pages/resumes/[resume]';

export function ResumeForm() {
    const client = useSupabaseClient<Database>()
    const form = useFormContext<FormValues>();
    const router = useRouter()
    // will this lead to a http call on every render?
    const session = useSession();
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2 border-r p-6 flex-shrink-0">
            <Button variant="link" className="pl-0" onClick={() => router.back()}>
                <ChevronLeft />
                <span>Back</span>
            </Button>

            <header>
                <h3 className="font-medium text-lg">Personal Information</h3>
                <p className="mb-4 text-sm text-muted-foreground">Provide your full name, professional title, and a brief overview of your personal profile. This section is your first impression, so make it count.</p>
            </header>

            <BasicInformationSection />
            <WorkExperienceSection />
            <ProjectsSection />
            <EducationSection />

            <Button loading={isSubmitting} className="flex items-center gap-1">
                <Save size={18} />
                <span>Save</span>
            </Button>
        </form>
    )
}

function BasicInformationSection() {
    const form = useFormContext<{ resume: Resume }>();
    const { formState: { errors }, register } = form;

    return (
        <section className="grid grid-cols-2 gap-4 bg-white mb-8">
            <Input
                autoFocus
                data-testid="fullname"
                label="Fullname"
                hint={<p className="text-destructive">{errors.resume?.full_name?.message}</p>}
                placeholder="fullname"
                {...register('resume.full_name', { required: { message: 'Name is required', value: true } })}
            />
            <Input
                data-testid="title"
                label="Title"
                placeholder="Title"
                {...register('resume.title')}
            />
            <Textarea
                data-testid="summary"
                rows={5}
                label="Professional summary"
                placeholder="Professional Summary"
                containerClasses="col-span-2"
                {...register('resume.professional_summary')}
            />
            <Input
                data-testid="location"
                label="Location"
                placeholder="Location"
                {...register('resume.location')}
            />
        </section>
    )
}

function AddSectionBtn({ children, ...props }: ButtonProps) {
    return (
        <Button type="button" variant="ghost" className="text-primary hover:text-primary flex items-center gap-1" {...props}>
            <Plus size={18} />
            <span className="text-sm">{children}</span>
        </Button>
    )
}

function WorkExperienceSection() {
    const client = useSupabaseClient<Database>()
    const session = useSession();
    const form = useFormContext<{ workExperience: WorkExperience[] }>();
    const { fields } = useFieldArray<{ workExperience: WorkExperience[] }, 'workExperience', '_id'>({ control: form.control, name: 'workExperience', keyName: '_id' });
    const { data: templateWorkExperience } = useQuery({
        queryFn: async () => {
            if (!session?.user?.id) throw new Error('User not logged in');
            const { data, error } = await client.from('work_experience').select().eq('user_id', session?.user?.id).filter('resume_id', 'is', null)
            if (error) throw error;
            return data;
        }
    })

    return (
        <section className="mb-4">
            <h3 className="font-medium text-lg">Work Experience</h3>
            <p className="mb-4 text-sm text-muted-foreground">Detail your professional history, including past positions held, responsibilities, key achievements, and the skills you developed. Tailor this section to the job you&apos;re applying for.</p>
            {fields.map((field, index) => (
                <WorkExperienceForm
                    field={field}
                    index={index}
                    form={form}
                    key={field._id}
                    onDeleteClick={() => {/** */ }}
                />
            ))}
            <MenuBar
                contentProps={{ side: 'bottom', align: 'start', className: 'min-w-72 shadow-sm' }}
                trigger={(
                    <AddSectionBtn>
                        Add Experience
                    </AddSectionBtn>
                )}
                onClick={e => e.stopPropagation()}
            >
                {templateWorkExperience?.map((workExperience) => {
                    const { company_name, job_title, id, start_date, end_date } = workExperience
                    const endDate = end_date ? formatDate(end_date) : 'Now'
                    return (
                        <MenuItem className="py-2" key={id}>
                            <p className="font-medium">{job_title} - {company_name}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(start_date)} - {endDate}</p>
                        </MenuItem>
                    )
                }
                )}
            </MenuBar>

        </section>
    )
}

function ProjectsSection() {
    const form = useFormContext<{ projects: Project[] }>();
    const { fields } = useFieldArray<{ projects: Project[] }, 'projects', '_id'>({ control: form.control, name: 'projects', keyName: '_id' });

    return (
        <section className="mb-4">
            <h3 className="font-medium text-lg">Projects</h3>
            <p className="mb-4 text-sm text-muted-foreground">Showcase specific projects you&apos;ve worked on that demonstrate your expertise and contributions. Include outcomes, technologies used, and your role in these projects.</p>
            {fields.map((field, index) => (
                <ProjectForm
                    field={field}
                    index={index}
                    form={form}
                    key={field._id}
                    onDeleteClick={() => {/** */ }}
                />
            ))}

            <AddSectionBtn>Add Project</AddSectionBtn>
        </section>
    )
}

function EducationSection() {
    const form = useFormContext<{ education: Education[] }>();
    const { fields } = useFieldArray<{ education: Education[] }, 'education', '_id'>({ control: form.control, name: 'education', keyName: '_id' });

    return (
        <section className="mb-4">
            <h3 className="font-medium text-lg">Education</h3>
            <p className="mb-4 text-sm text-muted-foreground">List your academic background, including degrees earned, institutions attended, and any honors or awards received. Relevant coursework can also be included here.</p>
            {fields.map((field, index) => (
                <EducationForm
                    field={field}
                    index={index}
                    form={form}
                    key={field._id}
                    onDeleteClick={() => {/** */ }}
                />
            ))}
            <AddSectionBtn>Add Education</AddSectionBtn>
        </section>
    )

}