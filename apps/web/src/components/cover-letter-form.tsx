'use client'

import { updateCoverLetter } from '@/actions/job'
import { useCoverLetter } from '@/hooks/useCoverLetter'
import { type Client } from '@/queries'
import { isAIFeatureEnabled } from '@/utils'
import { type CoverLetter, type Job } from 'lib/types'
import { Save, Wand2 } from 'lucide-react'
import { useMemo } from 'react'
import { Textarea } from 'ui/textarea'
import { Button } from 'ui/button'
import { Spinner } from 'ui/spinner'

async function onCoverLetterSave(client: Client, jobId: string, coverLetter: CoverLetter, text: string) {
    try {
        const { data: { user } } = await client.auth.getUser();
        if (!user) return;
        const { error } = await updateCoverLetter({ ...coverLetter, text }, user.id, jobId)
        if (error) throw error;
    } catch (error) {
        throw error
    }
}

export default function CoverLetterForm({ job, coverLetter }: { job: Job, coverLetter: CoverLetter }) {
    const aiFeaturesEnabled = useMemo(() => isAIFeatureEnabled(), [])
    const { saving, value, setValue } = useCoverLetter({
        jobId: job.id,
        coverLetter,
        onSave: onCoverLetterSave
    })

    return (
        <form className="flex flex-col gap-2 items-start h-full p-1 flex-1 w-3/5 pb-6">
            <Textarea
                onChange={ev => setValue(ev.target.value)}
                placeholder="Write your cover letter here"
                rows={20}
                value={value}
                // disabled={writing}
                className="w-full h-full p-4 pb-0 flex-1 text-accent-foreground rounded-sm mb-2 border"
                autoFocus
                containerProps={{
                    className: 'w-full flex-1'
                }}
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
