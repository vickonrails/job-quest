import { type HTMLAttributes } from 'react';
import { type DeepPartialSkipArrayKey } from 'react-hook-form';
import { formatDate, type Database } from 'shared';

export type Highlight = Database['public']['Tables']['highlights']['Row'];
export type Resume = Database['public']['Tables']['resumes']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Education = Database['public']['Tables']['education']['Row'] & { highlights?: Highlight[] };
export type WorkExperience = Database['public']['Tables']['work_experience']['Row'] & { highlights?: Highlight[] };

export interface FormValues {
    resume: Resume,
    projects: Project[],
    education: Education[]
    workExperience: WorkExperience[]
}

export function SectionHeading({ title, ...rest }: HTMLAttributes<HTMLHeadingElement> & { title: string }) {
    if (!title) return null;

    return (
        <h2 className="w-1/4 underline text-xs font-medium mb-4" {...rest}>{title}</h2>
    )
}

export function DateRange({ startDate, endDate }: { startDate?: string, endDate?: string }) {
    if (!(startDate)) return null;
    return (
        <div className="text-xs text-muted-foreground pr-2">
            {formatDate(startDate, true)} - {formatDate(endDate ?? 'Till Date', true)}
        </div>
    )
}

export function Complex({ values }: { values: DeepPartialSkipArrayKey<FormValues> }) {
    const { resume, education, projects, workExperience } = values

    const mailTo = resume?.email_address ? `mailto:${resume?.email_address}` : '';

    return (
        <section className="flex flex-col mx-auto bg-white">
            <header className="text-white py-6 mb-4 bg-teal-700">
                <div className="mx-auto max-w-2xl px-6">
                    <h1 className="font-bold text-xl uppercase">{resume?.full_name}</h1>
                    <p className="text-xs">{resume?.title}</p>
                    <div className='flex text-xs gap-4'>
                        <a href={mailTo}>{resume?.email_address}</a>
                        <p>{resume?.location}</p>
                    </div>
                </div>
            </header>

            <main className="flex w-full max-w-2xl mx-auto py-4 gap-6 px-6">
                <div className="flex-1">
                    <section className="mb-4">
                        <Heading>Summary</Heading>
                        <p className="text-xs">{resume?.professional_summary}</p>
                    </section>

                    <section>
                        <Heading>Experience</Heading>
                        {workExperience?.map(experience => (
                            <article key={experience.id} className="pb-3 mb-2 border-b border-dashed">
                                <header className="mb-2">
                                    <h3 className="font-bold text-xs">{experience.job_title}</h3>
                                    <p className="text-xs">{experience.company_name}</p>
                                    <div className="flex items-center">
                                        <DateRange endDate={experience.end_date ?? ''} startDate={experience.start_date} />
                                        <span className="text-xs">- {experience.location}</span>
                                    </div>
                                </header>

                                <ul className="list-disc ml-4">
                                    {experience.highlights?.map(highlight => (
                                        <li className="text-xs" key={highlight.id}>{highlight.text}</li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </section>
                </div>

                <aside className="w-1/3">
                    <section>
                        <Heading>Education</Heading>
                        {education?.map(education => (
                            <section key={education.id} className="mb-2 pb-2 border-b border-dashed last:border-none">
                                <header className="mb-1">
                                    <h3 className="font-bold text-xs">{education.degree} in {education.field_of_study}</h3>
                                    <p className="text-xs">{education.institution}</p>
                                </header>

                                <ul className="text-xs list-disc ml-4">
                                    {education.highlights?.map(highlight => (
                                        <li key={highlight.id}>{highlight.text}</li>
                                    ))}
                                </ul>
                            </section>
                        ))}
                    </section>

                    <section className='mb-3'>
                        <Heading>Skills</Heading>
                        <p className="text-xs">{resume?.skills?.map(x => x.label).join(' | ')}</p>
                    </section>

                    <section>
                        <Heading>Projects</Heading>
                        {projects?.map(project => (
                            <article key={project.id} className="mb-2 pb-2 border-b border-dotted last:border-none">
                                <header className="mb-1">
                                    <h3 className="font-bold text-xs">{project.title} ({project.url && <a href={project.url} className="text-xs text-teal-800 underline">Link</a>})</h3>
                                    <DateRange startDate={project.start_date ?? ''} endDate={project.end_date ?? ''} />
                                </header>
                                <p className="text-xs">{project.description}</p>
                            </article>
                        ))}
                    </section>
                </aside>
            </main>
        </section>
    )
}

function Heading(props: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3 className="border-b-2 border-teal-950 text-teal-800 text-sm font-medium uppercase mb-2" {...props} />
    )
}