import { Briefcase, MapPin } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Rating, Textarea } from 'ui';
import { useJob } from '~hooks/useJob';
import { getJobId } from '~utils';
import { Sheet, type SheetProps } from './sheet';
import { sendToBackground } from '@plasmohq/messaging';

interface JobInfoSheetProps extends SheetProps {
    onSubmit: () => void
}

function getJobDetails() {
    const img = document.querySelector('.jobs-company img');
    const title = document.querySelector('.jobs-unified-top-card .job-details-jobs-unified-top-card__job-title-link');
    const container = document.querySelector('.job-details-jobs-unified-top-card__primary-description-without-tagline')
    const company = container.querySelector('.app-aware-link')
    const location = container.childNodes[3]
    const link = window.location.href.split('&')[0];

    return {
        img: img?.getAttribute('src'),
        position: title.textContent,
        company_name: company.textContent,
        location: location.textContent.split(' ')[1],
        priority: 1,
        status: 0,
        source: 'LinkedIn',
        source_id: getJobId(),
        link
    }
}

interface Job {
    position: string
    company_name: string
    location: string
    notes?: string
    priority: number
    status?: number,
    link: string
}

export function JobInfoSheet(props: JobInfoSheetProps) {
    const { img, position, company_name, location, link, ...rest } = getJobDetails()
    const { register, control, handleSubmit } = useForm<Job>({ defaultValues: { position, company_name, location, link, ...rest } })
    const { isLoading, job } = useJob(getJobId())

    const onSubmit = (data: Job) => { }

    return (
        <Sheet {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                    <div className='m-1.5 hidden' />
                    <header className='flex gap-2 items-center'>
                        <img src={img} alt="Company Logo" style={{ height: 60, width: 60 }} />
                        <section className='flex flex-col gap-1'>
                            {position && <h2 className="text-base font-semibold text-foreground mb-1">{position}</h2>}
                            {company_name && (
                                <div className='flex items-center gap-1'>
                                    <Briefcase className='text-muted-foreground' size={16} />
                                    <p className="text-sm text-muted-foreground">{company_name}</p>
                                </div>
                            )}
                            {location && (
                                <div className='flex items-center gap-1'>
                                    <MapPin className='text-muted-foreground' size={16} />
                                    <p className="text-sm text-muted-foreground">{location}</p>
                                </div>
                            )}
                        </section>
                    </header>

                    <div>
                        <div className="m-1.5 select-none text-muted-foreground text-sm">Rating</div>
                        <Controller
                            name='priority'
                            control={control}
                            render={({ field }) => (
                                <Rating
                                    value={field.value}
                                    onClick={(val) => { field.onChange(val) }}
                                    size='md'
                                />
                            )}
                        />
                    </div>

                    <Textarea autoFocus className='py-2' label='Notes' {...register('notes')} />

                    <Button className='p-3' loading={isLoading}>
                        {job ? 'Update Job' : 'Add Job'}
                    </Button>
                    {job && <a href={`http://127.0.0.1:3000/jobs/${job.id}`}>See in Job Quest</a>}
                </div>
            </form>
        </Sheet>
    )
}