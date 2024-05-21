'use client'

import { useCoverLetter } from '@/hooks/useCoverLetter'
import { isAIFeatureEnabled } from '@/utils'
import { type CoverLetter, type Job } from 'lib/types'
import { Save, Wand2 } from 'lucide-react'
import { useMemo } from 'react'
import { Button } from 'ui/button'
import { Spinner } from 'ui/spinner'

export default function CoverLetterForm({ job, coverLetter }: { job: Job, coverLetter: CoverLetter }) {
    const aiFeaturesEnabled = useMemo(() => isAIFeatureEnabled(), [])

    const { onChange, saving, value } = useCoverLetter({ jobId: job.id, coverLetter })
    return (
        <form className="flex flex-col items-start h-full p-1 flex-1 w-3/5 pb-6">
            <textarea
                onChange={onChange}
                placeholder="Write your cover letter here"
                rows={20}
                value={value}
                // disabled={writing}
                className="w-full p-4 pb-0 flex-1 text-accent-foreground mb-2 border"
                autoFocus
            />
            <div className="flex gap-2 w-full justify-end items-center">
                {saving && (
                    <div className="flex-1">
                        <Spinner className="h-6 w-6" />
                    </div>
                )}

                <Button disabled={!aiFeaturesEnabled} type="button" variant="outline" className="flex gap-1" /** onClick={handleMagicWriteClick} loading={writing}**/>
                    <Wand2 size={18} />
                    <span>Magic Write</span>
                </Button>

                <Button type="button" className="flex gap-1">
                    <Save size={18} />
                    <span>Copy</span>
                </Button>
            </div>
        </form>
    )
}
