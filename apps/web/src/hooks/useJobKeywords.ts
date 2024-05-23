
import { createClient } from '@/utils/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type Job } from 'lib/types'
import { useState } from 'react'

/**
 * provides functionality for extracting keywords from a job description
 * @param job 
 * @returns 
 */
export function useJobKeywords(job: Job) {
    const client = createClient()
    const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient()

    const updateJobMutation = useMutation({
        mutationFn: async (job: Job) => {
            const { data, error } = await client.from('jobs').update(job).eq('id', job.id).select()
            if (error) {
                throw error
            }
            return data
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['jobs', job.id], { jobs: data })
        }
    })

    const generateKeywords = async ({ description }: { description: string }) => {
        try {
            setLoading(true)
            const response = await fetch('/api/resume/generate-keywords', {
                method: 'POST',
                body: JSON.stringify({ description }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.status !== 200) throw new Error('Failed to generate keywords')
            const { keywords } = await response.json() as { keywords: string[] }
            await updateJobMutation.mutateAsync({ ...job, keywords })
        } finally {
            setLoading(false)
        }
    }
    return { loading, generateKeywords }
}