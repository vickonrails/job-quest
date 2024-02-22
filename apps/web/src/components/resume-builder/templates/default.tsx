import { useFormContext, useWatch } from 'react-hook-form';
import { type FormValues } from 'src/pages/resumes/[resume]';

export function DefaultTemplate() {
    const { control } = useFormContext<FormValues>();
    const { resume, workExperience, education, projects } = useWatch<FormValues>({ control: control });
    return (
        <section className="text-sm flex flex-col gap-2">
            <section className="border p-2">
                <p><span className="font-bold">Full name</span>: {resume?.full_name}</p>
                <p><span className="font-bold">Email Address</span>: {resume?.email_address}</p>
                <p><span className="font-bold">Title</span>: {resume?.title}</p>
                <p><span className="font-bold">Summary</span>: {resume?.professional_summary}</p>
                <p><span className="font-bold">Location</span>: {resume?.location}</p>
                <p><span className="font-bold">LinkedIn</span>: {resume?.linkedin_url}</p>
            </section>

            <section className="border p-2">
                <h2 className="font-bold">Work Experience</h2>
                {workExperience?.map(experience => (
                    <p key={experience.id}>{experience.job_title} at {experience.company_name}</p>
                ))}
            </section>

            <section className="border p-2">
                <h2 className="font-bold">Education</h2>
                {education?.map(education => (
                    <p key={education.id}>{education.field_of_study} at {education.institution}</p>
                ))}
            </section>

            <section className="border p-2">
                <h2 className="font-bold">Projects</h2>
                {projects?.map(project => (
                    <p key={project.id}>{project.title}</p>
                ))}
            </section>

            <section className="border p-2">
                <h2 className="font-bold">Skills</h2>
                {resume?.skills?.map((skill, idx) => (
                    <p key={idx}>{skill.label}</p>
                ))}
            </section>
        </section>
    )
}