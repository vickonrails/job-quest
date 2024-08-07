import { type HTMLAttributes } from 'react';
import { type DeepPartialSkipArrayKey } from 'react-hook-form';
import { formatDate } from 'shared';
import { type Education, type Project, type Resume, type WorkExperience } from '../types';

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

export function DateRange({ startDate, endDate }: { startDate?: string | null, endDate?: string }) {
    if (!(startDate)) return null;
    return (
        <div className="text-xs text-muted-foreground pr-2">
            {formatDate(startDate, true)} - {formatDate(endDate ?? 'Till Date', true)}
        </div>
    )
}

export function Simple({ values }: { values: DeepPartialSkipArrayKey<FormValues> }) {
    const { resume, education, projects, workExperience } = values

    const mailTo = resume?.email_address ? `mailto:${resume?.email_address}` : '';

    return (
        <section className="py-3 flex flex-col max-w-2xl mx-auto my-4 px-6">
            <section className="flex justify-between mb-6">
                <div>
                    <h1 className="font-bold">{resume?.full_name}</h1>
                    <p className="text-xs">{resume?.title}</p>
                </div>

                <ul className="text-right">
                    <a href={mailTo} className="text-xs block text-primary">{resume?.email_address}</a>
                    <p className="text-xs">{resume?.location}</p>
                </ul>
            </section>

            <section className="flex mb-4">
                <SectionHeading title="SUMMARY" />
                <p className="flex-1 text-xs">{resume?.professional_summary}</p>
            </section>

            <section className="flex mb-4">
                <SectionHeading title="SKILLS & TOOLS" />
                <div className="flex flex-1 justify-end">
                    <p className="text-xs">{resume?.skills?.map(x => x.label).join(', ')}</p>
                </div>
            </section>

            <section className="pb-2">
                <SectionHeading title="WORK EXPERIENCE" />
                {workExperience?.map((work, idx) => {
                    const { start_date, end_date, job_title, location, highlights, company_name } = work
                    return (
                        <article key={idx} className="flex mb-4">
                            <div className="flex-1">
                                <div className="mb-2">
                                    {(company_name && job_title) && (
                                        <div className="flex gap-2 items-center justify-between">
                                            <h2 className="font-bold text-xs">{job_title} - {company_name}</h2>
                                            <DateRange startDate={start_date ?? ''} endDate={end_date ?? 'Till Date'} />
                                        </div>
                                    )}
                                    {location && (
                                        <p className="text-xs text-muted-foreground">{location}</p>
                                    )}
                                </div>

                                <div className="highlights-description" dangerouslySetInnerHTML={{ __html: highlights ?? '' }} />
                            </div>
                        </article>
                    )
                })}
            </section>

            <section>
                <SectionHeading title="EDUCATION" />
                {education?.map((education, idx) => {
                    const { end_date, start_date, institution, highlights, degree, field_of_study, location } = education
                    return (
                        <article className="flex mb-4" key={idx}>
                            <div className="flex-1">
                                <header className="flex items-center gap-2">
                                    <h2 className="font-bold text-xs">{institution}, {location}</h2>
                                    <p className="text-xs">- {degree}, {field_of_study}</p>
                                </header>
                                <DateRange startDate={start_date} endDate={end_date ?? 'Till Date'} />

                                <div className="highlights-description" dangerouslySetInnerHTML={{ __html: highlights ?? '' }} />
                            </div>
                        </article>
                    )
                })}
            </section>


            <section>
                <SectionHeading title="OTHER PROJECTS" />
                {projects?.map((project, idx) => {
                    const { skills, title, url, highlights } = project
                    return (
                        <article className="flex mb-4" key={idx}>
                            <div className="flex-1">
                                <header className="text-xs mb-1">
                                    <h2 className="font-bold">{title} ({url && <a href={url} className="text-xs text-primary">Link</a>})</h2>
                                    <div className="highlights-description" dangerouslySetInnerHTML={{ __html: highlights ?? '' }} />
                                </header>

                                <section>
                                    {!(skills?.length === 0) && (
                                        <p className="text-xs">
                                            <span className="font-medium">Tech Stack</span>: <span className="text-muted-foreground">{skills?.map(x => x.label).join(', ')}</span>
                                        </p>
                                    )}
                                </section>

                            </div>
                        </article>
                    )
                })}
            </section>

        </section>
    )
}