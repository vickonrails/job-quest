'use client'

import { FileText, X } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import { Button } from 'ui/button'

import { Progress } from 'ui/progress'

export function ResumeImportProgress({ filename, isUploading }: { filename: string, isUploading: boolean }) {
    if (isUploading) {
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
