'use client'

import { type JobImportColumns } from '@/app/(main)/jobs-tracker/import-jobs/api/route'
import { FileText, FileWarning, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { Status_Lookup } from 'shared'
import { Alert, AlertDescription, AlertTitle } from 'ui/alert'
import { UploadButton } from '../pdf-upload-button'
import { ResumeImportProgress } from '../resume-import-progress'
import { type Column } from '../table'
import { useToast } from '../toast/use-toast'
import { UploadCardContent, UploadCardHint, type SupportedFormats } from './upload-card'

const maxSize = 5

/**
 * fetch function to import jobs
 */
async function importJobs(file: ArrayBuffer): Promise<any> {
    const headers = { 'Content-Type': 'application/octet-stream' }
    const response = await fetch('import-jobs/api', {
        method: 'POST',
        headers,
        body: file
    })

    if (!response.ok) {
        const { error, success } = await response.json() as { error: string, success: boolean }
        if (!success) {
            throw new Error(error)
        }
    }

    return await response.json()
}

/**
 * Content of JobImport upload component
 */
export function JobsImportContent({ supportedFormats = [], setJobs }: { supportedFormats: SupportedFormats[], jobs: JobImportColumns[], setJobs: (jobs: JobImportColumns[]) => void }) {
    const [uploading, setUploading] = useState(false)
    const [filename, setFilename] = useState('')
    const [errors, setErrors] = useState('')
    const { toast } = useToast()

    const onFilePicked = async (file: ArrayBuffer, filename: string) => {
        setErrors('')
        setUploading(true)
        setFilename(filename)
        try {
            const { data, success, error } = await importJobs(file)
            if (!success) throw new Error(error)
            setJobs(data)
            toast({
                title: 'Jobs imported successfully',
                variant: 'success'
            })
        } catch (error) {
            if (error instanceof Error) {
                setErrors(error.message)
                toast({
                    title: 'An error occurred',
                    variant: 'destructive'
                })
            }
        } finally {
            setUploading(false)
        }
    }

    return (
        <>
            <section className="mb-4">
                <UploadCardContent>
                    {errors && <UploadErrorHint error={errors} />}
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

/**
 * Show progress of the import
 */
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
        </section>
    )
}

/**
 * show errors from the import
 */
function UploadErrorHint({ error }: { error: string }) {
    const errors = error.split('\n');

    return (
        <Alert className="bg-destructive-foreground text-sm text-destructive">
            <FileWarning size={18} />
            <AlertTitle>Invalid import data</AlertTitle>
            <AlertDescription className="text-muted-foreground">{errors.map(err => <div key={err}>{err}</div>)}</AlertDescription>
        </Alert>
    )
}