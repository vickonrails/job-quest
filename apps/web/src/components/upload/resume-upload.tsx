'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useToast } from '../toast/use-toast'
import { UploadButton } from '../pdf-upload-button'
import { type SupportedFormats, UploadCardContent, UploadCardHint } from './upload-card'
import { ResumeImportProgress } from '../resume-import-progress'
import Link from 'next/link'
import { Button } from 'ui/button'
import { ChevronRight, FileText, UploadCloud } from 'lucide-react'
import { Progress } from 'ui/progress'

// TODO: haven an intermediate component
async function extractResumeData(file: ArrayBuffer): Promise<string> {
    const headers = { 'Content-Type': 'application/octet-stream' }
    const response = await fetch('resume-upload/api', {
        method: 'POST',
        headers,
        body: file
    })

    if (!response.ok) {
        // throw error
    }

    return await response.json()
}

const maxSize = 5

export function ResumeUploadCardContent({ supportedFormats }: { supportedFormats: SupportedFormats[] }) {
    const router = useRouter()
    const [uploading, setUploading] = useState(false)
    const [filename, setFilename] = useState('')
    const { toast } = useToast()

    const onFilePicked = async (file: ArrayBuffer, filename: string) => {
        setUploading(true)
        setFilename(filename)
        try {
            // TODO: better error handling here
            // FInd a way to determine if there was an error or not
            const response = await extractResumeData(file)
            if (response) {
                toast({
                    title: 'Profile uploaded successfully',
                    variant: 'success'
                })
                router.push('/profile/setup')
                setUploading(false)
            }
        } catch (error) {
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
                    </span>
                    <div className="text-center max-w-sm">
                        <p className="text-muted-foreground text-sm">
                            Import a recent resume to setup your profile. <span className="font-bold text-accent-foreground">Overwrites previous profile Info!</span>
                        </p>
                    </div>

                    <UploadButton
                        loadingContent={uploading && 'Uploading...'}
                        loading={uploading}
                        onFilePicked={onFilePicked}
                        variant="outline"
                    >
                        Select Resume
                    </UploadButton>
                </UploadCardContent>

                <UploadCardHint>
                    <p>Supported format {supportedFormats?.join(',').toUpperCase()}</p>
                    <p>Max size {maxSize}MB</p>
                </UploadCardHint>
            </section>

            <>
                <ResumeImportProgress
                    filename={filename}
                    isUploading={uploading}
                    LoadingComponent={LoadingComponent}
                />

                <div className="flex justify-end items-center">
                    <Link href="/profile/setup">
                        <Button variant="link" className="flex" disabled={uploading}>
                            Skip to manual setup
                            <ChevronRight size={16} />
                        </Button>
                    </Link>
                </div>
            </>
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