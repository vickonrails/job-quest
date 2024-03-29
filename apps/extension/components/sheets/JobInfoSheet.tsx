import { sendToBackground } from '@plasmohq/messaging';
import { Briefcase, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm, type UseFormRegister } from 'react-hook-form';
import { Banner, Button, Input, Rating, Spinner, Textarea } from 'ui';
import { isLinkedIn } from '~contents';
import { useJob } from '~hooks/useJob';
import { getJobId } from '~utils';
import { Sheet, type SheetProps } from './sheet';

export interface JobInfoSheetProps extends SheetProps {
    onSubmit: () => void
    jobInfo: Partial<Job>
}

export function getJobDetails(): Partial<Job> {
    const link = window.location.href;

    if (!isLinkedIn) return { link }

    const isFullPage = window.location.href.includes('jobs/view');
    let title: HTMLElement | ChildNode | null;

    const img = document.querySelector('.jobs-company img');
    const container = document.querySelector('.job-details-jobs-unified-top-card__primary-description-without-tagline')

    if (isFullPage) {
        title = document.querySelector('.jobs-unified-top-card .job-details-jobs-unified-top-card__job-title').childNodes[0];
    } else {
        title = document.querySelector('.jobs-unified-top-card .job-details-jobs-unified-top-card__job-title-link');
    }

    if (container) {
        const company = container.querySelector('.app-aware-link')
        const location = Boolean(container) ? container.childNodes[3] : ''
        const details = document.querySelector('#job-details');

        return {
            id: '',
            img: img?.getAttribute('src') ?? '',
            position: title?.textContent ?? '',
            company_name: company.textContent,
            location: location ? location.textContent.split(' ')[1] : '',
            priority: 1,
            status: 0,
            source: 'linkedIn',
            source_id: getJobId(),
            description: details?.innerHTML ?? '',
            link
        }
    }


    return {
        // TODO: remove img and use initials
        id: '',
        img: img?.getAttribute('src') ?? '',
        position: title?.textContent ?? '',
        priority: 1,
        status: 0,
        source: 'linkedIn',
        source_id: getJobId()
    }
}

interface Job {
    img?: string
    id: string
    position: string
    company_name: string
    location: string
    description: string
    notes?: string
    priority: number
    status?: number,
    link: string
    source: string,
    source_id: string
}

// TODO: improve this to just take the job object
export function JobInfoSheet(props: JobInfoSheetProps) {
    // TODO: this is going to fetch the job using the link to check if its in the database
    const { isLoading, job, refresh } = useJob(getJobId())
    const { register, control, handleSubmit, formState: { isSubmitting }, reset } = useForm<Job>({
        defaultValues: { id: job ? job.id : '', ...props.jobInfo }
    })
    const [showBanner, setShowBanner] = useState({ show: false, error: false })

    useEffect(() => {
        if (!job) return
        reset({ ...job })
    }, [job])

    // remove source because the single source of truth is the url that the job was brought in through
    const onSubmit = async ({ img, ...data }: Job) => {
        // first determine source of job (linkedIn etc)
        try {
            const res = await sendToBackground<Job>({
                name: 'add-job',
                body: { source: isLinkedIn ? 'linkedIn' : null, source_id: getJobId(), ...data }
            });

            if (res.error || !res.success) {
                throw new Error(res.error);
            }

            if (res.success) {
                refresh(res.job);
                reset({ notes: '', ...res.job });
                setShowBanner({ show: true, error: false })
            }

        } catch (error) {
            setShowBanner({ show: true, error: true })
        }
    }

    const { show, error } = showBanner

    return (
        <Sheet {...props}>
            <form onSubmit={handleSubmit(onSubmit)} className='text-primary-foreground'>
                {show && (
                    <Banner className='flex my-5 gap-2 text-sm' variant={error ? 'error' : 'success'}>
                        {error ? 'Could not add Job' : 'Successful'}
                    </Banner>
                )}
                <input type='hidden' {...register('id')} />
                <div className="flex flex-col gap-4">
                    <div className='m-1.5 hidden' />

                    {isLoading ? <SpinnerContainer /> : (
                        <>
                            <PopupHeader jobInfo={props.jobInfo} register={register} />
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

                                <Textarea className='py-2' label='Notes' {...register('notes')} autoFocus={isLinkedIn || false} />

                                <div>
                                    <Button className='p-3 block w-full mb-2' loading={isSubmitting}>
                                        {job ? 'Update Job' : 'Add Job'}
                                    </Button>

                                    {job && <a className='text-center underline block' target='_blank' rel="noreferrer noopener" href={`http://127.0.0.1:3000/jobs/${job.id}`}>See in Job Quest</a>}
                                </div>

                            </section>
                        </>
                    )}
                </div>
            </form>
        </Sheet>
    )
}

function PopupHeader({ jobInfo, register }: { jobInfo: Partial<Job>, register: UseFormRegister<Job> }) {
    if (isLinkedIn) {
        const { img, position, company_name, location } = jobInfo ?? {}
        return (
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
                            {jobInfo && (
                                <div className='select-none bg-green-100 text-xs text-green-800 rounded-full p-2 py-1'>Added</div>
                            )}
                        </div>
                    )}
                </section>
            </header>
        )
    }

    return (
        <>
            <Input
                autoFocus
                label="Job Title"
                className='text-accent-foreground bg-inherit'
                {...register('position')}
            />
            <Input
                label="Company name"
                {...register('company_name')}
            />
            <Input
                label="Location"
                {...register('location')}
            />
        </>
    )
}


function SpinnerContainer() {
    return (
        <div className='flex justify-center mt-6'>
            <Spinner />
        </div>
    )
}