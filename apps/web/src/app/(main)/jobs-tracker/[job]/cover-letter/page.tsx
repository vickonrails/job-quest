import { MainShell } from '@/app/(main)/layout'
import BackButton from '@/components/back-button'
import CoverLetterForm from '@/components/cover-letter-form'
import { getCoverLetter, getJob } from '@/db/api'

export default async function CoverLetter({ params }: { params: { job: string } }) {
    const { data: job } = await getJob(params.job)
    const coverLetter = await getCoverLetter(params.job)
    if (!job || !coverLetter) return

    return (
        <MainShell title={`Cover Letter - ${job?.position}`}>
            <section className="p-6 overflow-hidden">
                <BackButton>Back to Job</BackButton>
                <div className="flex h-full gap-1">
                    <CoverLetterForm coverLetter={coverLetter} job={job} />
                    <div className="p-4 w-2/5 border overflow-auto mt-1">
                        <p>{job?.position}</p>
                        <div
                            className="text-neutral-600 text-sm"
                            dangerouslySetInnerHTML={{ __html: job?.description ?? '' }}
                        />
                    </div>
                </div>
            </section>
        </MainShell>
    )
}