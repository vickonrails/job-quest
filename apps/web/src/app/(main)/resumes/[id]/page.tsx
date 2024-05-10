import ResumeFormPreview from '@/components/resume-builder/resume-form-preview'
import { getResume } from '@/queries/jobs'

export default async function ResumeDetails({ params }: { params: { id: string } }) {
    const resume = await getResume(params.id)
    if (!resume) return null;
    return (
        <main className="overflow-auto">
            <ResumeFormPreview resume={resume} />
        </main>
    )
}
