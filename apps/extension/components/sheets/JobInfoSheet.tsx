import { sendToBackground } from '@plasmohq/messaging';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Banner } from 'ui';
import { AuthGuard } from '~components/auth-guard';
import { isLinkedIn } from '~contents/linkedin';
import { useJob } from '~hooks/useJob';
import type { Job, JobInsertDTO } from '~types';
import { getJobUrl } from '~utils/get-job-content';
import { JobInfoTabs } from './job-info-tabs';
import { MovableDialog } from './movable-dialog';
import { type SheetProps } from './sheet';

export interface JobInfoSheetProps extends SheetProps {
    onSubmit: () => void
    jobInfo: Partial<Job>
}

const getDefaultJobData = (jobInfo: Partial<Job>): JobInsertDTO => {
    return {
        ...jobInfo,
        user_id: '',
        position: jobInfo.position ?? '',
        location: jobInfo.location ?? '',
        company_name: jobInfo.company_name ?? '',
        description: jobInfo.description ?? '',
        link: jobInfo.link ?? '',
        company_site: jobInfo.company_site ?? '',
        status: 0
    }
}

interface AddJobResponse {
    success: boolean,
    error: string,
    job?: Job
}

// TODO: improve this to just take the job object
export function JobInfoSheet(props: JobInfoSheetProps) {
    const { jobInfo } = props
    const url = getJobUrl()
    const { isLoading, job, refresh } = useJob(url, {
        defaultData: getDefaultJobData(jobInfo)
    })
    const form = useForm<JobInsertDTO>({
        defaultValues: {
            id: job ? job.id : '',
            ...props.jobInfo
        }
    })

    const [showBanner, setShowBanner] = useState({
        show: false, error: false
    })

    useEffect(() => {
        if (!job) return
        form.reset({ ...job })
    }, [job, form])

    const onSubmit = async ({ img, ...data }: Job) => {
        try {
            const job = {
                source: isLinkedIn ? 'linkedIn' : null,
                ...data
            }
            const res = await sendToBackground<Job, AddJobResponse>({
                name: 'add-job',
                body: job
            });

            if (res.error || !res.success) {
                throw new Error(res.error);
            }

            if (res.success) {
                refresh({ ...res.job, img });
                form.reset({ notes: '', ...res.job });
                setShowBanner({ show: true, error: false })
            }

        } catch (error) {
            setShowBanner({ show: true, error: true })
        }
    }

    const { show, error } = showBanner

    return (
        <MovableDialog {...props}>
            <AuthGuard>
                <form onSubmit={form.handleSubmit(onSubmit)} className="text-accent-foreground">
                    <div className="tiptap hidden"></div>
                    {show && (
                        <Banner className="flex my-5 gap-2 text-sm" variant={error ? 'error' : 'success'}>
                            {error ? 'Could not add Job' : 'Successful'}
                        </Banner>
                    )}
                    <JobInfoTabs
                        fetchingJob={isLoading}
                        job={job}
                        form={form}
                    />
                </form>
            </AuthGuard>
        </MovableDialog>
    )
}