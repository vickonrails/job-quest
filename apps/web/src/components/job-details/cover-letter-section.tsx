
'use client'

import { type Job } from 'lib/types'
import { useRouter } from 'next/navigation'
import { Button } from 'ui'

export function CoverLetterSection({ job }: { job: Job }) {
    const router = useRouter()
    const coverLetterId = job.cover_letter_id

    const navigateToCoverletter = () => {
        const url = `/jobs-tracker/${job.id}/cover-letter`
        return router.push(url)
    }

    return (
        <section className="border-b pb-6">
            <div className="mb-3 flex flex-col gap-3">
                <header>
                    <h3 className="font-medium">Add Cover Letter</h3>
                    <p className="text-sm text-muted-foreground">Begin from scratch or allow magic write provide a starting point.</p>
                </header>
            </div>

            <div className="flex gap-2">
                <Button
                    onClick={navigateToCoverletter}
                    variant="outline"
                >
                    {coverLetterId ? 'Update Cover Letter' : 'Add Cover Letter'}
                </Button>
            </div>
        </section>
    )
}