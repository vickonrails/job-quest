import { JobsImportContent } from '@/components/upload/jobs-import';
import { type SupportedFormats, UploadCard } from '@/components/upload/upload-card';

const supportedFormats: SupportedFormats[] = ['xlsx', 'xls']
export default function ImportJobs() {
    return (
        <section className="max-w-xl mx-auto mt-20 w-full">
            <UploadCard
                Content={(
                    <JobsImportContent
                        supportedFormats={supportedFormats} />
                )}
                title="Import jobs"
                supportedFormats={supportedFormats}
                maxSize={12}
            />
        </section>
    )
}
