import { sendToBackground } from '@plasmohq/messaging';
import { useMessage } from '@plasmohq/messaging/hook';
import { Grip } from 'lucide-react';
import { useState } from 'react';
import { Banner } from 'ui';
import { AuthGuard } from '~components/auth-guard';
import { isLinkedIn } from '~contents/linkedin';
import { useJob } from '~hooks/useJob';
import type { Job } from '~types';
import { JobInfoTabs } from './job-info-tabs';
import { useMovableDialog } from './movable-dialog';
import { Sheet, type SheetProps } from './sheet';

export interface JobInfoSheetProps extends SheetProps {
    onURLChange: (url: string) => void
    url: string
    // onSubmit: () => void
    // job: JobInsertDTO
    // isLoading?: boolean
    // setJob: (job: Job) => void
}

interface AddJobResponse {
    success: boolean,
    error: string,
    job?: Job
}

// TODO: improve this to just take the job object
export function JobInfoSheet({ ...props }: JobInfoSheetProps) {
    const { job, isLoading, setJob, form } = useJob(props.url)

    useMessage((req, res) => {
        if (req.name === 'refresh-grabber') {
            props.onURLChange(window.location.href)
        }
    })

    const { buttonRef, dialogRef } = useMovableDialog()

    const [showBanner, setShowBanner] = useState({
        show: false, error: false
    })

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
                setJob({ ...res.job, img });
                form.reset({ notes: '', ...res.job });
                setShowBanner({ show: true, error: false })
            }

        } catch (error) {
            setShowBanner({ show: true, error: true })
        }
    }

    const { show, error } = showBanner

    return (
        <Sheet ref={dialogRef} {...props}>
            <button className="absolute -left-12 shadow-sm border bg-white p-2 cursor-move" ref={buttonRef}>
                <Grip size={18} />
            </button>
            <AuthGuard className="overflow-auto h-full">
                <form onSubmit={form.handleSubmit(onSubmit)} className="text-accent-foreground">
                    <div className="tiptap hidden"></div>
                    {show && (
                        <Banner className="flex m-2 mt-4 gap-2 text-sm" variant={error ? 'error' : 'success'}>
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
        </Sheet>
    )
}