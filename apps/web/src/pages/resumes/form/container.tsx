import { EducationForm } from '@components/resume-builder/setup/education/education-form-item';
import { ProjectForm } from '@components/resume-builder/setup/projects/project-form-item';
import { WorkExperienceForm } from '@components/resume-builder/setup/work-experience/work-experience-form-item';
import { Textarea } from '@components/textarea';
import { type Profile, type Education, type Project, type WorkExperience } from '@lib/types';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Input } from 'ui';

export function ResumeForm() {
    const form = useFormContext<{ profile: Profile }>();
    const { register, formState: { errors } } = form

    return (
        <section className="w-1/2 border-r p-6 flex-shrink-0">
            <section className="grid grid-cols-2 gap-4 p-4 bg-white mb-8">
                <Input
                    autoFocus
                    data-testid="fullname"
                    label="Fullname"
                    hint={<p className="text-destructive">{errors.profile?.full_name?.message}</p>}
                    placeholder="fullname"
                    {...register('profile.full_name', { required: { message: 'Name is required', value: true } })}
                />
                <Input
                    data-testid="title"
                    label="Title"
                    placeholder="Title"
                    {...register('profile.title')}
                />
                <Textarea
                    data-testid="summary"
                    rows={5}
                    label="Professional summary"
                    placeholder="Professional Summary"
                    containerClasses="col-span-2"
                    {...register('profile.professional_summary')}
                />
                <Input
                    data-testid="location"
                    label="Location"
                    placeholder="Location"
                    {...register('profile.location')}
                />
            </section>

            <WorkExperienceSection />
            <ProjectsSection />
            <EducationSection />
        </section>
    )
}

function WorkExperienceSection() {
    const form = useFormContext<{ workExperience: WorkExperience[] }>();
    const { fields } = useFieldArray<{ workExperience: WorkExperience[] }, 'workExperience', '_id'>({ control: form.control, name: 'workExperience', keyName: '_id' });

    return (
        <section>
            {fields.map((field, index) => (
                <WorkExperienceForm
                    field={field}
                    index={index}
                    form={form}
                    key={field._id}
                    onDeleteClick={() => {/** */ }}
                />
            ))}
        </section>
    )
}

function ProjectsSection() {
    const form = useFormContext<{ projects: Project[] }>();
    const { fields } = useFieldArray<{ projects: Project[] }, 'projects', '_id'>({ control: form.control, name: 'projects', keyName: '_id' });

    return (
        <section>
            {fields.map((field, index) => (
                <ProjectForm
                    field={field}
                    index={index}
                    form={form}
                    key={field._id}
                    onDeleteClick={() => {/** */ }}
                />
            ))}
        </section>
    )
}

function EducationSection() {
    const form = useFormContext<{ education: Education[] }>();
    const { fields } = useFieldArray<{ education: Education[] }, 'education', '_id'>({ control: form.control, name: 'education', keyName: '_id' });

    return (
        <section>
            {fields.map((field, index) => (
                <EducationForm
                    field={field}
                    index={index}
                    form={form}
                    key={field._id}
                    onDeleteClick={() => {/** */ }}
                />
            ))}
        </section>
    )

}