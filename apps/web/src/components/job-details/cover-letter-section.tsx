
'use client'

import { useRouter } from 'next/navigation'
import { Button } from 'ui/button'

export function CoverLetterSection({ jobId }: { jobId: string }) {
    const router = useRouter()

    const navigateToCoverletter = () => {
        const url = `/jobs-tracker/${jobId}/cover-letter`
        return router.push(url)
    }

    return (
        <section className="border-b pb-6">
            <div className="mb-3 flex flex-col gap-3">
                <header>
                    <h3 className="font-medium text-secondary-foreground">Add Cover Letter</h3>
                    <p className="text-sm text-muted-foreground">Begin from scratch or allow magic write provide a starting point.</p>
                </header>
            </div>

            <div className="flex gap-2">
                <Button
                    onClick={navigateToCoverletter}
                    variant="outline"
                >
                    Update Cover Letter
                </Button>
            </div>
        </section>
    )
}