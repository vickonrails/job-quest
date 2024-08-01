import Image from 'next/image'
import Searching from '../../../public/searching.svg'
import { KeywordsSection } from './keywords'
import { type Job } from 'lib/types'
import { Button } from 'ui/button'

export function JobDescription({ job, showEditSheet }: { job: Job, showEditSheet: (job: Job) => void }) {
    if (!job.description) {
        return (
            <div className="border p-20 flex flex-col items-center gap-4">
                <Image src={Searching} className="mx-auto" width={200} height={200} alt="" />
                <h3 className="text-center text-muted-foreground">Job description not available</h3>
                <Button size="sm" onClick={() => showEditSheet(job)}>Add Description</Button>
            </div>
        )
    }

    return (
        <>
            <KeywordsSection job={job} />
            <main className="mb-6">
                <section className="border p-3 rounded-md">
                    <div className="text-muted-foreground" id="__description" dangerouslySetInnerHTML={{ __html: job.description ?? '' }} />
                </section>
            </main>
        </>
    )
}

