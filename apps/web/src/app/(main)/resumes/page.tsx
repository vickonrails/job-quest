import NewButton from '@/components/resume-builder/new-button';
import { ResumePreviewCard } from '@/components/resume-card';
import { getResumes } from '@/queries/jobs';

export default async function ResumePage() {
    const resumes = await getResumes();
    return (
        <section className="p-6">
            <header className="flex justify-end items-center mb-4">
                <NewButton />
            </header>

            <section className="flex flex-wrap gap-4">
                {resumes?.map((resume) => (
                    <ResumePreviewCard
                        key={resume.id}
                        resume={resume}
                    />
                ))}
            </section>
        </section>
    )
}
