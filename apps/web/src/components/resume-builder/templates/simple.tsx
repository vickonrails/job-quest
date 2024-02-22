import { formatDate } from '@components/utils';
import { type HTMLAttributes } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { type FormValues } from 'src/pages/resumes/[resume]';

export function SectionHeading({ title, ...rest }: HTMLAttributes<HTMLHeadingElement> & { title: string }) {
    if (!title) return null;

    return (
        <h2 className="w-1/4 underline text-xs font-medium mb-2" {...rest}>{title}</h2>
    )
}

export function DateRange({ startDate, endDate }: { startDate?: string, endDate?: string }) {
    if (!(startDate)) return null;
    return (
        <div className="w-1/4 text-[10px] mt-0.5 pr-2">
            {formatDate(startDate, true)} - {formatDate(endDate ?? 'Till Date', true)}
        </div>
    )
}

export function SimpleTemplate() {
    const { control } = useFormContext<FormValues>();
    const { resume, workExperience, education, projects } = useWatch<FormValues>({ control: control });

    const mailTo = resume?.email_address ? `mailto:${resume?.email_address}` : '';

    return (
        <section className="py-3 px-1 flex flex-col max-w-xl bg-white mx-auto my-4">
            <section className="flex justify-between mb-6">
                <div>
                    <h1 className="font-bold">{resume?.full_name}</h1>
                    <p className="text-xs">{resume?.title}</p>
                </div>

                <ul className="text-right">
                    <a href={mailTo} className="text-xs block text-primary">{resume?.email_address}</a>
                    {/* <a href={`tel:${phoneNumber}`} className="text-xs block">{resume?.}</a> */}
                    <p className="text-xs">{resume?.location}</p>
                </ul>
            </section>

            <section className="flex mb-4">
                <SectionHeading title="SUMMARY" />
                <p className="flex-1 text-xs">{resume?.professional_summary}</p>
            </section>

            <section className="flex mb-4">
                <SectionHeading title="SKILLS & TOOLS" />
                <div className="flex flex-1 justify-end text-muted-foreground">
                    <p className="text-xs">{resume?.skills?.map(x => x.label).join(', ')}</p>
                </div>
            </section>

            <section className="pb-2">
                <SectionHeading title="WORK EXPERIENCE" />
                {workExperience?.map((work, idx) => {
                    const { start_date, end_date, job_title, location, highlights, company_name } = work
                    return (
                        <article key={idx} className="flex mb-4">
                            <DateRange startDate={start_date} endDate={end_date ?? 'Till Date'} />
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    {(company_name && job_title) && (
                                        <h2 className="font-medium text-xs">{job_title} - {company_name}</h2>
                                    )}
                                    {location && (
                                        <p className="text-xs">{location}</p>
                                    )}
                                </div>
                                <ul className="text-xs list-disc ml-3 text-muted-foreground flex flex-col gap-1">
                                    {highlights?.map((highlight) => (
                                        <li key={highlight.id}>{highlight.text}</li>
                                    ))}
                                </ul>
                            </div>
                        </article>
                    )
                })}
            </section>

            <section>
                <SectionHeading title="EDUCATION" />
                {education?.map((education, idx) => {
                    const { end_date, start_date, institution, degree, field_of_study, location } = education
                    return (
                        <article className="flex mb-4" key={idx}>
                            <DateRange startDate={start_date} endDate={end_date ?? 'Till Date'} />
                            <div className="flex-1">
                                <header className="mb-2">
                                    <h2 className="font-medium text-xs">{institution}, {location}</h2>
                                    <p className="text-xs mb-2">{degree}, {field_of_study}</p>
                                </header>

                                {/* <ul className="text-xs text-muted-foreground list-disc flex flex-col gap-1">
                                    <HighlightsList highlights={highlights ?? []} />
                                    {highlights}
                                </ul> */}
                            </div>
                        </article>
                    )
                })}
            </section>


            <section>
                <SectionHeading title="OTHER PROJECTS" />
                {projects?.map((project, idx) => {
                    const { description, skills, title, url } = project
                    return (
                        <article className="flex mb-4" key={idx}>
                            <section className="w-1/4 pr-4 text-muted-foreground">
                                {!(skills?.length === 0) && (
                                    <p className="text-xs">
                                        <span className="text-black">Tech Stack</span>: {skills?.map(x => x.label).join(', ')}
                                    </p>
                                )}
                            </section>

                            <div className="flex-1">
                                <header className="mb-1 text-xs">
                                    <h2 className="font-medium">{title}</h2>
                                    {url && <a href={url} className="text-xs text-primary">{url}</a>}
                                    <p className="text-muted-foreground">{description}</p>
                                </header>

                                {/* <div className="text-xs text-muted-foreground">
                                    {highlights}
                                </div> */}
                            </div>
                        </article>
                    )
                })}
            </section>

        </section>
    )
}