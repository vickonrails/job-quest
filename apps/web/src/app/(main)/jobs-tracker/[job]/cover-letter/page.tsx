
import BackButton from '@/components/back-button'
import CoverLetterForm from '@/components/cover-letter-form'
import { getCoverLetter, getJob } from '@/db/api'

export default async function CoverLetter({ params }: { params: { job: string } }) {
    const { data: job } = await getJob(params.job)
    const coverLetter = await getCoverLetter(params.job)
    if (!job || !coverLetter) return

    return (
        <section className="p-6 overflow-hidden h-full">
            <BackButton>Back to Job</BackButton>
            <div className="flex h-full gap-1">
                <CoverLetterForm coverLetter={coverLetter} job={job} />
                <div className="p-4 w-2/5 border overflow-auto mt-1">
                    <p className="mb-2">{job?.position}</p>
                    <div
                        id="__description"
                        className="text-sm text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: job?.description ?? '' }}
                    />
                </div>
            </div>
        </section>
    )
}