'use client'

import { FileText } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import { Button } from 'ui/button'

interface ResumeImportProgress {
    filename: string,
    isUploading: boolean
    children?: React.ReactNode
    LoadingComponent: React.ComponentType<{ filename: string }>
}

export function ResumeImportProgress({ filename, isUploading, LoadingComponent }: ResumeImportProgress) {
    if (isUploading) {
        return (
            <LoadingComponent filename={filename} />
        )
    }

    return (
        <section className="bg-accent rounded-md p-4 py-2 mb-3">
            <header className="flex justify-between gap-2 items-center">
                <FileText className="text-muted-foreground" />
                <h2 className="text-sm flex-1 font-medium text-muted-foreground">Simple PDFs work best</h2>
                <Button variant="outline" size="xs" asChild>
                    <Link target="_blank" rel="noreferrer noopener" href="https://docs.google.com/document/d/1FRwpN1Tv0-DFrzMJ8RhArsBugeiC4YI_PwlVrgXIaJk/edit?usp=sharing">See Sample</Link>
                </Button>
            </header>
        </section>

    )
}
