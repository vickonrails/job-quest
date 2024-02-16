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
        // let timer;
        sendToBackground<{ id: string }, BackgroundResponse<JobResponse>>({
            name: 'get-job',
            body: { id }
        }).then((res) => {
            // timer = setTimeout(() => {
            const { data, success } = res
            if (success) setJob(data.job);
            // }, 1500)
        }).catch(err => {
            console.log({ err })
            // handle error
        }).finally(() => {
            setIsLoading(false)
        })

        // return () => {
        //     clearTimeout(timer)
        // }
    }, [id])

    const refresh = useCallback((job: Job) => {
        setJob(job)
    }, [id])

    return { isLoading, job, refresh }
}
