import { sendToBackground } from "@plasmohq/messaging";
import { useCallback, useEffect, useState } from "react";
import type { BackgroundResponse, Job } from "~types";

interface JobResponse {
    job: Job
}

/**
 * responsible for fetching the job from the background script
 */
export const useJob = (url: string) => {
    const [isLoading, setIsLoading] = useState(true);
    const [job, setJob] = useState<Job>();

    useEffect(() => {
        sendToBackground<{ url: string }, BackgroundResponse<JobResponse>>({
            name: 'get-job',
            body: { url }
        }).then((res) => {
            // TODO: refresh job once it's been added
            const { data, success } = res
            if (success) setJob(data.job);
        }).catch(err => {
            console.log({ err })
        }).finally(() => {
            setIsLoading(false)
        })
    }, [url])

    const refresh = useCallback((job: Job) => {
        setJob(job)
    }, [url])

    return { isLoading, job, refresh }
}
