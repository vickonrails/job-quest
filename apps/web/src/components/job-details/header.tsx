import hashColors from '@/utils/hash-colors'
import { getDisplayText } from '@/components/avatar/Avatar'
import { Typography } from '@/components/typography'
import { ExternalLink } from 'lucide-react'
import { Status_Lookup, cn, formatDate } from 'shared'
import { Button, Rating } from 'ui'
import { type Job } from 'lib/types'

export function Header({ job, onEditClick }: { job: Job, onEditClick: (job: Job) => void }) {
    const status = Status_Lookup.find((x, idx) => idx === job.status)
    return (
        <header className="mb-4">
            <div className="flex items-start mb-4">
                <div className="mr-4">
                    <DefaultImage companyName={job.company_name} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <Typography variant="display-xs-md" className="mb-1 text-base-col">{job.position}</Typography>
                        <Button size="sm" variant="outline" onClick={_ => onEditClick(job)} className="inline-block py-1">Edit</Button>
                    </div>
                    <ul className="flex gap-6 text-light-text list-disc">
                        <li className="list-none max-w-[200px]">
                            <p>{job.company_name}</p>
                        </li>
                        {job.location && <li>{job.location}</li>}
                        <li>{status}</li>
                    </ul>

                    <div className="flex flex-col items-start">
                        {job.created_at && (
                            <div className="flex text-muted-foreground items-center gap-1">
                                Saved on {formatDate(job.created_at)}
                            </div>
                        )}
                        <a target="_blank" rel="noreferrer noopener" className="flex gap-1 items-center text-sm underline text-primary" href={job.link ?? ''}>
                            <span>Link to source</span>
                            <ExternalLink size={16} />
                        </a>
                    </div>
                </div>
                <Rating size="md" value={job.priority ?? 0} />
            </div>
        </header>
    )
}

function DefaultImage({ companyName }: { companyName: string }) {
    const variants = ['bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-pink-500', 'bg-purple-500']
    const backgroundColor = hashColors(companyName, variants)
    return (
        <div className={cn('text-white h-24 p-2 w-24 text-3xl font-bold', backgroundColor)}>
            {getDisplayText(companyName)}
        </div>
    )
}
