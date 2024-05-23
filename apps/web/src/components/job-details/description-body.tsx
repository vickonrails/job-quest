import Image from 'next/image'
import Searching from '../../../public/searching.svg'
import { KeywordsSection } from './keywords'
import { type Job } from 'lib/types'

export function JobDescription({ job }: { job: Job }) {
    if (!job.description) {
        return (
            <div className="border p-20 flex flex-col gap-10">
                <Image src={Searching} className="mx-auto" width={300} height={300} alt="" />
                <h3 className="text-center text-muted-foreground">Job description not available</h3>
            </div>
        )
    }

    return (
        <>
            <KeywordsSection job={job} />
            <main className="mb-6">
                <section className="border p-3 rounded-md">
                    <div className="text-base-col" id="__description" dangerouslySetInnerHTML={{ __html: job.description ?? '' }} />
                </section>
            </main>
        </>
    )
}

