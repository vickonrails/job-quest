import { sendToBackground } from '@plasmohq/messaging';
import { Briefcase, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Rating, Spinner, Textarea } from 'ui';
import { useJob } from '~hooks/useJob';
import { getJobId } from '~utils';
import { Sheet, type SheetProps } from './sheet';

interface JobInfoSheetProps extends SheetProps {
    onSubmit: () => void
}

function getJobDetails() {
    const isFullPage = window.location.href.includes('jobs/view');
    let title: HTMLElement | ChildNode | null;

    const img = document.querySelector('.jobs-company img');
    const container = document.querySelector('.job-details-jobs-unified-top-card__primary-description-without-tagline')
    const company = container.querySelector('.app-aware-link')
    const location = container.childNodes[3]
    const link = isFullPage ? window.location.href.split('?')[0] : window.location.href.split('&')[0];

    if (isFullPage) {
        title = document.querySelector('.jobs-unified-top-card .job-details-jobs-unified-top-card__job-title').childNodes[0];
    } else {
        title = document.querySelector('.jobs-unified-top-card .job-details-jobs-unified-top-card__job-title-link');
    }

    return {
        img: img?.getAttribute('src'),
        position: title?.textContent ?? '',
        company_name: company.textContent,
        location: location.textContent.split(' ')[1],
        priority: 1,
        status: 0,
        source: 'linkedIn',
        source_id: getJobId(),
        link
    }
}

interface Job {
    id: string
    position: string
    company_name: string
    location: string
    notes?: string
    priority: number
    status?: number,
    link: string
    source: string,
    source_id: string
}

export function JobInfoSheet(props: JobInfoSheetProps) {
    const { img, position, company_name, location, link, ...rest } = getJobDetails()
    const { isLoading, job, refresh } = useJob(getJobId())
    const { register, control, handleSubmit, formState: { isSubmitting }, reset } = useForm<Job>({
        defaultValues: { id: job ? job.id : '', position, company_name, location, link, ...rest }
    })

    useEffect(() => {
        if (!job) return
        reset({ ...job })
    }, [job])

    const onSubmit = async (data: Job) => {
        try {
            const res = await sendToBackground<Job>({
                name: 'add-job',
                body: { source: 'linkedIn', source_id: getJobId(), ...data }
            });

            if (res.error || !res.success) {
                throw new Error(res.error);
            }

            if (res.success) {
                alert('Job added')
                refresh(res.job);
                reset({ notes: '', ...res.job });
            }

        } catch (error) {
            alert('Error')
        }
    }

    return (
        <Sheet {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type='hidden' {...register('id')} />
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
                                <div className='flex gap-2'>
                                    <div className='flex items-center gap-1'>
                                        <MapPin className='text-muted-foreground' size={16} />
                                        <p className="text-sm text-muted-foreground">{location}</p>
                                    </div>
                                    {job && (
                                        <div className='select-none bg-green-100 text-xs text-green-800 rounded-full p-2 py-1'>Added</div>
                                    )}
                                </div>
                            )}
                        </section>
                    </header>

                    {isLoading ? <SpinnerContainer /> : (
                        <section className='flex flex-col gap-4'>
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

                            <div>
                                <Button className='p-3 block w-full mb-2' loading={isSubmitting}>
                                    {job ? 'Update Job' : 'Add Job'}
                                </Button>

                                {job && <a className='text-center underline block' target='_blank' rel="noreferrer noopener" href={`http://127.0.0.1:3000/jobs/${job.id}`}>See in Job Quest</a>}
                            </div>
                        </section>
                    )}
                </div>
            </form>
        </Sheet>
    )
}

function SpinnerContainer() {
    return (
        <div className='flex justify-center mt-6'>
            <Spinner />
        </div>
    )
}