import { type Job } from '@lib/types'
import { useRouter } from 'next/router'
import { Button } from 'ui'
import { v4 as uuid } from 'uuid'

export function CoverLetterSection({ job }: { job: Job }) {
    const router = useRouter()
    const coverLetterId = job.cover_letter_id

    const navigateToCoverletter = () => {
        const url = `/cover-letters/${coverLetterId ?? uuid()}?job-id=${job.id}`
        return router.push(url)
    }

    return (
        <section className="border-b pb-6">
            <div className="mb-3 flex flex-col gap-3">
                <header>
                    <h3 className="font-medium">Add Cover Letter</h3>
                    <p className="text-sm text-muted-foreground">Pick an already created resume or create a new one.</p>
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