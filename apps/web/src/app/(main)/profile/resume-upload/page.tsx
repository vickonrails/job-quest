import { ResumeUploadCardContent } from '@/components/upload/resume-upload'
import { UploadCard } from '@/components/upload/upload-card'


export default function UploadResumePage() {
    return (
        <main className="w-full">
            <section className="max-w-xl mx-auto mt-20 w-full">
                <UploadCard
                    maxSize={5}
                    supportedFormats={['pdf']}
                    title="Setup your Profile"
                    Content={<ResumeUploadCardContent supportedFormats={['pdf']} />}
                />
            </section>
        </main>
    )
}

