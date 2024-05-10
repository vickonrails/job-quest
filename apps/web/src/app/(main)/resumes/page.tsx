import { ResumePreviewCard } from '@/components/resume-card';
import { getResumes } from '@/queries/jobs';
import { Button } from 'ui/button';

export default async function ResumePage() {
    const resumes = await getResumes();
    return (
        <section className="p-6">
            <header className="flex justify-end items-center mb-4">
                <Button>
                    Create New
                </Button>
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
