'use client'

import { PDFUploadButton } from '@/components/pdf-upload-button'
import { ResumeImportProgress } from '@/components/resume-import-progress'
import { useToast } from '@/components/toast/use-toast'
import { AlertCircleIcon, ChevronRight, UploadCloud, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from 'ui/alert'
import { Button } from 'ui/button'

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

export function UploadResumeCard() {
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
        <section className="border h-auto mx-auto p-4 rounded-md shadow-sm">
            <header className="mb-6">
                <h1 className="font-medium mb-2">Setup your Profile</h1>
            </header>
            <div className="flex flex-col gap-4 items-center border-dashed border border-blue-200 p-6 py-14 rounded-md mb-1">
                <span className="border rounded-full p-3" >
                    <UploadCloud size={30} />
                </span>
                <div className="text-center max-w-sm">
                    <p className="text-muted-foreground text-sm">
                        Import a recent resume to setup your profile. <span className="font-bold text-accent-foreground">Overwrites previous profile Info!</span>
                    </p>
                </div>

                <PDFUploadButton
                    loadingContent={uploading && 'Uploading...'}
                    loading={uploading}
                    onFilePicked={onFilePicked}
                    variant="outline"
                >
                    Select Resume
                </PDFUploadButton>
            </div>

            <section className="flex justify-between text-xs text-muted-foreground mb-6">
                <p>Supported format PDF</p>
                <p>Max size 5mb</p>
            </section>

            <ResumeImportProgress
                filename={filename}
                isUploading={uploading}
            />

            <div className="flex justify-end items-center">
                <Link href="/profile/setup">
                    <Button variant="link" className="flex" disabled={uploading}>
                        Skip to manual setup
                        <ChevronRight size={16} />
                    </Button>
                </Link>
            </div>
        </section >
    )
}
