import { sendToBackground } from '@plasmohq/messaging';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { BackgroundResponse, Job, JobInsertDTO } from '~types';
import { getJobDetails } from '~utils/get-job-content';

interface JobResponse {
    job: Job
}

async function fetchJob(url: string) {
    return await sendToBackground<{ url: string }, BackgroundResponse<JobResponse>>({
        name: 'get-job',
        body: { url }
    })
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * responsible for fetching the job from the background script
 */
export const useJob = (url: string) => {
    const [isLoading, setIsLoading] = useState(true);
    const [job, setJob] = useState<JobInsertDTO>();

    const form = useForm<JobInsertDTO>({
        defaultValues: {
            id: job ? job.id : '',
            ...job
        }
    })

    useEffect(() => {
        fetchJob(url).then((res) => {
            setIsLoading(true)
            return delay(1000).then(() => {
                const { data, success } = res
                const initialDetails = getJobDetails();
                let jobDetails;
                if (success) {
                    jobDetails = {
                        ...initialDetails,
                        ...data.job
                    }
                } else {
                    jobDetails = initialDetails
                }

                setJob(jobDetails)
                form.reset(jobDetails)
            }).catch(err => {
                console.error(err)
            })
        }).catch(err => {
            console.error(err)
        }).finally(() => {
            setIsLoading(false)
        })
    }, [url, form])
    return { isLoading, job, setJob, form }
}
