'use client'

import { PDFUploadButton } from '@/components/pdf-upload-button'
import { ResumeImportProgress } from '@/components/resume-import-progress'
import { ChevronRight, UploadCloud } from 'lucide-react'
import Link from 'next/link'
import { Button } from 'ui/button'

async function extractResumeData(file: ArrayBuffer): Promise<string> {
    const headers = {
        'Content-Type': 'application/octet-stream'
    }

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
    const onFilePicked = async (file: ArrayBuffer) => {
        try {
            const data = await extractResumeData(file)
            console.log(data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <section className="border h-auto mx-auto p-4 rounded-md shadow-sm">
            <h1 className="font-medium mb-10">Setup your Profile</h1>
            <div className="flex flex-col gap-4 items-center border-dashed border p-6 rounded-md mb-2">
                <span className="border rounded-full p-3" >
                    <UploadCloud size={30} />
                </span>
                <div className="text-center max-w-sm">
                    <p className="text-muted-foreground text-sm">
                        <span className="font-bold">Import a recent resume (5mb max)</span> to setup your profile. Skip this step to fill out your profile manually.
                    </p>
                </div>

                <PDFUploadButton onFilePicked={onFilePicked} variant="outline">Select Resume</PDFUploadButton>
            </div>

            <ResumeImportProgress />

            <div className="flex justify-end items-center">
                <Link href="/profile/setup">
                    <Button variant="link" className="flex">
                        Skip to manual setup
                        <ChevronRight size={16} />
                    </Button>
                </Link>
            </div>
        </section >
    )
}