'use client'

import { Chip } from '@/components/chip';
import { useToast } from '@/components/toast/use-toast';
import { isAIFeatureEnabled } from '@/utils';
import { type Job } from 'lib/types';
import { ChevronDown, ChevronUp, Wand2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useJobKeywords } from 'src/hooks/useJobKeywords';
import { Button } from 'ui/button';

/**
 * KeywordsSection
 */
export function KeywordsSection({ job }: { job: Job }) {
    const { loading, generateKeywords } = useJobKeywords(job)
    const { toast } = useToast()
    const aiFeaturesEnabled = useMemo(() => isAIFeatureEnabled(), [])

    const handleGenerateClick = async () => {
        try {
            await generateKeywords({ description: job.description ?? '' });
        } catch {
            toast({
                variant: 'destructive',
                title: 'Failed to generate keywords',
            })
        }
    }

    return (
        <section className="p-4 border flex flex-col items-start gap-2 mb-4">
            <div>
                <h3 className="font-medium">Relevant Keywords</h3>
                <p className="text-muted-foreground">Certain keywords, when added to your resume & cover letter can help your application rank higher in automated systems like ATS (Applicant Tracking Systems).</p>
            </div>
            {job.keywords ? (
                <Keywords
                    keywords={job.keywords}
                />
            ) : (
                <Button
                    // disabled={!aiFeaturesEnabled}
                    variant="outline"
                    className="gap-2 items-center"
                    onClick={handleGenerateClick}
                    loading={loading}
                >
                    <Wand2 size={18} />
                    <span>Generate Keywords</span>
                </Button>
            )}
        </section>
    )
}

/**
 * Keywords List
 */
function Keywords({ keywords, limit: initialLimit = 7 }: { keywords: string[], limit?: number }) {
    const [limit, setLimit] = useState(initialLimit);
    const handleLimitToggle = () => {
        setLimit((prev) => prev === keywords.length ? initialLimit : keywords.length)
    }

    const expanded = Boolean(limit === keywords.length)

    return (
        <section>
            <ul>
                {keywords.slice(0, limit).map((keyword, idx) => (<Chip key={`${keyword}-${idx}`} label={keyword} />))}
            </ul>
            <Button
                onClick={handleLimitToggle}
                variant="ghost"
                className="items-center"
            >
                {expanded ? 'Show Less' : 'Show More'}
                {expanded ? <ChevronUp size={18} /> :
                    <ChevronDown size={18} />
                }
            </Button>
        </section>
    )
}