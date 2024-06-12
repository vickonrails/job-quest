'use client'

import { X } from 'lucide-react'
import * as React from 'react'
import { Button } from 'ui/button'

import { Progress } from 'ui/progress'

export function ResumeImportProgress() {
    const [progress, setProgress] = React.useState(13)

    React.useEffect(() => {
        const timer = setTimeout(() => setProgress(66), 500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <>
            <p className="text-sm py-2 text-muted-foreground">Uploading...</p>
            <section className="border rounded-md p-4">
                <header className="flex justify-between items-center mb-2">
                    <h2 className="text-xs font-medium text-muted-foreground">Resume.pdf</h2>
                    {/* <Button variant="ghost" size="sm"><X size={12} /></Button> */}
                    <Button variant="ghost" size="sm"><X size={12} /></Button>
                </header>
                <Progress value={progress} className="w-full" />
            </section>
        </>
    )
}
