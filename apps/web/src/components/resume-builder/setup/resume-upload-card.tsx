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
            console.error(error)
            toast({
                title: 'An error occurred',
                variant: 'destructive'
            })
        }
    }

    return (
        <section className="border h-auto mx-auto p-4 rounded-md shadow-sm">
            <header className="mb-4">
                <h1 className="font-medium mb-2">Setup your Profile</h1>
                {uploading ? <UploadAlert /> : <InfoAlert />}
            </header>
            <div className="flex flex-col gap-4 items-center border-dashed border p-6 rounded-md mb-2">
                <span className="border rounded-full p-3" >
                    <UploadCloud /**className={cn(uploading && 'animate-ping')}**/ size={30} />
                </span>
                <div className="text-center max-w-sm">
                    <p className="text-muted-foreground text-sm">
                        <span className="font-bold">Import a recent resume (5mb max)</span> to setup your profile. Skip this step to fill out your profile manually.
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

            {uploading && (
                <ResumeImportProgress filename={filename} />
            )}

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

function UploadAlert() {
    return (
        <Alert variant="default" className="text-sm flex gap-3 items-start">
            <div><AlertCircleIcon /></div>
            <section className="flex-1">
                <AlertTitle>Might take a few seconds.</AlertTitle>
                <AlertDescription className="text-muted-foreground">Extracting information from your resume.</AlertDescription>
            </section>
            <div>
                <Button variant="ghost" size="sm"><X size={12} /></Button>
            </div>
        </Alert>
    )
}

function InfoAlert() {
    return (
        <Alert variant="default" className="text-sm px-2 py-1 flex gap-2 items-center">
            <div><AlertCircleIcon /></div>
            <AlertTitle className="flex-1 m-0">This overrides all your previously saved profile data.</AlertTitle>
            <div>
                <Button variant="ghost" size="sm"><X size={12} /></Button>
            </div>
        </Alert>
    )
}