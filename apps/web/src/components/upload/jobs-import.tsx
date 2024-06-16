'use client'

import { type JobImportColumns } from '@/app/(main)/jobs-tracker/import-jobs/api/route'
import { FileText, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { Status_Lookup } from 'shared'
import { Progress } from 'ui/progress'
import { UploadButton } from '../pdf-upload-button'
import { ResumeImportProgress } from '../resume-import-progress'
import { type Column } from '../table'
import { useToast } from '../toast/use-toast'
import { UploadCardContent, UploadCardHint, type SupportedFormats } from './upload-card'

// TODO: haven an intermediate component

const maxSize = 5

async function importJobs(file: ArrayBuffer): Promise<any> {
    const headers = { 'Content-Type': 'application/octet-stream' }
    const response = await fetch('import-jobs/api', {
        method: 'POST',
        headers,
        body: file
    })

    if (!response.ok) {
        // throw error
    }

    return await response.json()
}

export const columns: Column<JobImportColumns> = [
    { header: 'Position', type: 'text', renderValue: (item) => ({ text: item.position }) },
    { header: 'Company Name', type: 'logoWithText', renderValue: (item) => ({ text: item.company_name }) },
    {
        header: 'Status', type: 'text', renderValue: (item) => {
            const status = Status_Lookup.find((x, idx) => idx === Number(item.status))
            return { text: status ?? '' }
        }
    },
    { header: 'Rating', type: 'rating', renderValue: (item) => ({ rating: Number(item.priority) ?? 0 }) },
]

export function JobsImportContent({ supportedFormats = [], setJobs }: { supportedFormats: SupportedFormats[], jobs: JobImportColumns[], setJobs: (jobs: JobImportColumns[]) => void }) {
    const [uploading, setUploading] = useState(false)
    const [filename, setFilename] = useState('')
    const { toast } = useToast()

    const onFilePicked = async (file: ArrayBuffer, filename: string) => {
        setUploading(true)
        setFilename(filename)
        try {
            const { data, success } = await importJobs(file)
            if (!success) throw new Error('An error occurred')
            setJobs(data)
            setUploading(false)
            toast({
                title: 'Jobs imported successfully',
                variant: 'success'
            })
        } catch (error) {
            setUploading(false)
            toast({
                title: 'An error occurred',
                variant: 'destructive'
            })
        }
    }

    return (
        <>
            <section className="mb-4">
                <UploadCardContent>
                    <span className="border rounded-full p-3" >
                        <UploadCloud size={30} />
                    </span >
                    <div className="text-center max-w-sm">
                        <p className="text-muted-foreground text-sm">
                            Upload an {supportedFormats.join(', ')} file to import your jobs
                        </p>
                    </div>

                    <UploadButton
                        loadingContent={uploading && 'Uploading...'}
                        loading={uploading}
                        onFilePicked={onFilePicked}
                        variant="outline"
                    >
                        Select File
                    </UploadButton>
                </UploadCardContent >

                <UploadCardHint>
                    <p>Supported format {supportedFormats?.join(',').toUpperCase()}</p>
                    <p>Max size {maxSize}MB</p>
                </UploadCardHint>
            </section >

            <ResumeImportProgress
                filename={filename}
                isUploading={uploading}
                LoadingComponent={LoadingComponent}
            />
        </>
    )
}

function LoadingComponent({ filename }: { filename: string }) {
    return (
        <section className="bg-accent rounded-md p-4 mb-3">
            <header className="flex justify-between gap-2 items-center">
                <FileText className="text-muted-foreground" />
                <div className="flex-1 text-muted-foreground">
                    <h2 className="text-sm font-medium">Uploading {filename ?? 'your file'}...</h2>
                    <p className="text-xs">Might take a while (Extracting important information)...</p>
                </div>
            </header>
            <Progress className="mt-2" value={50} />
        </section>
    )
}

