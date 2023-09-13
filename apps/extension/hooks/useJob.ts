import { sendToBackground } from "@plasmohq/messaging";
import { useCallback, useEffect, useState } from "react";
import type { BackgroundResponse, Job } from "~types";

interface JobResponse {
    job: Job
}

/**
 * responsible for fetching the job from the background script
 */
export const useJob = (id: string) => {
    const [isLoading, setIsLoading] = useState(true);
    const [job, setJob] = useState<Job>();

    useEffect(() => {
        let timer;
        setIsLoading(true)
        sendToBackground<{ id: string }, BackgroundResponse<JobResponse>>({
            name: 'get-job',
            body: { id }
        }).then(({ data }) => {
            timer = setTimeout(() => {
                setJob(data.job)
                setIsLoading(false)
            }, 1500)
        }).catch(err => {
            // handle error
        })

        return () => {
            clearTimeout(timer)
        }
    }, [id])

    const refresh = useCallback((job: Job) => {
        setJob(job)
    }, [id])

    return { isLoading, job, refresh }
}
