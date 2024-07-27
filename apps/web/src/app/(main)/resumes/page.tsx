import NewButton from '@/components/resume-builder/new-button';
import { ResumePreviewCard } from '@/components/resume-card';
import { getResumes } from '@/api/resume.api';
import { unstable_noStore as noStore} from 'next/cache';

export default async function ResumePage() {
    noStore()
    const resumes = await getResumes();
    return (
        <section className="p-6 overflow-auto">
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
