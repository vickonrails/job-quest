'use client'

import { updateCoverLetter } from '@/actions/job'
import { useCoverLetter } from '@/hooks/useCoverLetter'
import { type Client } from '@/queries'
import { isAIFeatureEnabled } from '@/utils'
import { type CoverLetter, type Job } from 'lib/types'
import { Copy } from 'lucide-react'
import { useMemo } from 'react'
import { cn } from 'shared'
import { Spinner } from 'ui/spinner'
import { Editor } from './editor/tiptap-editor'

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
    // const aiFeaturesEnabled = useMemo(() => isAIFeatureEnabled(), [])
    const { saving, value, setValue } = useCoverLetter({
        jobId: job.id,
        coverLetter,
        onSave: onCoverLetterSave
    })

    return (
        <form className="flex flex-col gap-2 items-start h-full p-1 flex-1 w-3/5 pb-6">
            <Editor
                onChange={(text) => setValue(text)}
                EditorHeaderRight={<EditorHeaderRight saving={saving} />}
                value={value}
                className="w-full h-full"
                containerProps={{ className: 'w-full h-full' }}
            />
        </form>
    )
}

function EditorHeaderRight({ saving }: { saving: boolean, aiFeaturesEnabled?: boolean }) {
    const handleCopy = () => {/**TODO: handle copy to clipboard */ }
    return (
        <div className="flex gap-2 w-full justify-end items-center">
            {saving && (
                <div className="flex-1">
                    <Spinner className="h-6 w-6" />
                </div>
            )}
            <button
                className={cn('p-2 hover:bg-accent border-transparent rounded-md border active:border-border focus:border-border')}
                type="button"
                onClick={handleCopy}
            >
                <Copy size={14} />
            </button>
        </div>
    )
}