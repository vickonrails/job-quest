import { sendToBackground } from '@plasmohq/messaging';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Banner } from 'ui';
import { isLinkedIn } from '~contents';
import { useJob } from '~hooks/useJob';
import type { Job } from '~types';
import { getJobUrl } from '~utils';
import { Sheet, type SheetProps } from './sheet';
import { JobInfoTabs } from './tabs';

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
    const source = isLinkedIn ? 'linkedIn' : null;

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
            source,
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
        source
    }
}

const getDefaultJobData = (jobInfo: Partial<Job>): Job => {
    return {
        ...jobInfo,
        position: jobInfo.position ?? '',
        location: jobInfo.location ?? '',
        company_name: jobInfo.company_name ?? '',
        description: jobInfo.description ?? '',
        link: jobInfo.link ?? ''
    }
}


// TODO: improve this to just take the job object
export function JobInfoSheet(props: JobInfoSheetProps) {
    const { jobInfo } = props
    // TODO: this is going to fetch the job using the link to check if its in the database
    const { isLoading, job, refresh } = useJob(getJobUrl(), { defaultData: getDefaultJobData(jobInfo) })
    const form = useForm<Job>({
        defaultValues: { id: job ? job.id : '', ...props.jobInfo }
    })
    const [showBanner, setShowBanner] = useState({ show: false, error: false })

    useEffect(() => {
        if (!job) return
        form.reset({ ...job })
    }, [job])

    const onSubmit = async ({ img, ...data }: Job) => {
        try {
            const res = await sendToBackground<Job>({
                name: 'add-job',
                body: { source: isLinkedIn ? 'linkedIn' : null, ...data }
            });

            if (res.error || !res.success) {
                throw new Error(res.error);
            }

            if (res.success) {
                refresh(res.job);
                form.reset({ notes: '', ...res.job });
                setShowBanner({ show: true, error: false })
            }

        } catch (error) {
            setShowBanner({ show: true, error: true })
        }
    }

    const { show, error } = showBanner

    return (
        <Sheet {...props}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='text-accent-foreground'>
                <div className='tiptap hidden'></div>
                {show && (
                    <Banner className='flex my-5 gap-2 text-sm' variant={error ? 'error' : 'success'}>
                        {error ? 'Could not add Job' : 'Successful'}
                    </Banner>
                )}
                <JobInfoTabs
                    fetchingJob={isLoading}
                    job={job}
                    form={form}
                />
            </form>
        </Sheet>
    )
}




