import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "lib/database.types";
import { Job } from "lib/types";
import { useEffect, useState } from "react"

export const useJobs = (): [boolean, Job[]] => {
    const client = useSupabaseClient<Database>();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            return await client.from('jobs').select();
        }

        fetchJobs().then(res => {
            if (res.data) {
                setJobs(res.data);
                setLoading(false)
            }
        }).catch(err => {
            setLoading(false);
            setJobs([])
        })
    }, [loading, client]);

    return [loading, jobs];
}