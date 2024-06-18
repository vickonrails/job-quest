'use client'

import { createResumeFromProfile } from '@/db/actions/resume'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from 'ui/button'
import { useToast } from '../toast/use-toast'

export default function NewButton() {
    const router = useRouter()
    const [creating, setCreating] = useState(false)
    const { toast } = useToast()

    const handleCreateNew = async () => {
        setCreating(true)
        const { success, data } = await createResumeFromProfile()
        if (success && data) {
            router.push(`/resumes/${data.id}`);
        } else {
            toast({
                variant: 'destructive',
                title: 'An error occurred'
            })
            setCreating(false)
        }
    }

    return (
        <Button size="sm" loading={creating} onClick={handleCreateNew} disabled={creating}>
            {creating ? 'Creating...' : 'Create New'}
        </Button>
    )
}
