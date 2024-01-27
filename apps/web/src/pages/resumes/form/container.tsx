import { Textarea } from '@components/textarea';
import { type Education, type Profile, type Project, type WorkExperience } from '@lib/types';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Input } from 'ui';
import { type FormValues } from '../builder';

export function ResumeForm({ profile, profileEducation, profileWorkExperience, profileProjects }: { profile: Profile, profileEducation: Education[], profileWorkExperience: WorkExperience[], profileProjects: Project[] }) {
    const form = useFormContext<FormValues>();
    const { register, control, formState: { errors } } = form
    const { fields } = useFieldArray<FormValues, 'workExperience', '_id'>({ control, name: 'workExperience', keyName: '_id' });

    return (
        <section>
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

            <section>
                <p className="font-bold">Profile Education</p>
                <ul className="list-disc list-inside">
                    {profileEducation.map(education => (
                        <li key={education.id}>{education.institution}</li>
                    ))}
                </ul>
            </section>

            <section>
                <p className="font-bold">Profile Work Experience</p>
                <ul className="list-disc list-inside">
                    {profileWorkExperience.map(experience => (
                        <li key={experience.id}>{experience.company_name}</li>
                    ))}
                </ul>
            </section>

            <section>
                <p className="font-bold">Profile Projects</p>
                <ul className="list-disc list-inside">
                    {profileProjects.map(projects => (
                        <li key={projects.id}>{projects.title}</li>
                    ))}
                </ul>
            </section>


            <section>
                <p className="font-bold">Profile Projects</p>
                <ul className="list-disc list-inside">
                    {profile.skills?.map(skill => (
                        <li key={skill.label}>{skill.label}</li>
                    ))}
                </ul>
            </section>
        </section>
    )
}