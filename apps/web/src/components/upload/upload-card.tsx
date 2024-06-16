'use client'

import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from 'shared'

export type SupportedFormats = 'pdf' | 'xlsx' | 'xls'

export interface UploadCardProps extends HTMLAttributes<HTMLDivElement> {
    title: string
    Content?: ReactNode

    // TODO: I might not need these stuff
    filename?: string
    uploading?: boolean

    supportedFormats: SupportedFormats[]
    maxSize: number
}

export function UploadCardContent({ className, children }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
    return (
        <div className={cn('flex flex-col gap-4 items-center border-dashed border border-blue-200 p-6 py-14 rounded-md mb-1', className)}>
            {children}
        </div>
    )
}

export function UploadCardHint({ children }: { children: ReactNode }) {
    return (
        <section className="flex justify-between text-xs text-muted-foreground mb-6">
            {children}
        </section>
    )
}

export function UploadCard({ title, Content }: UploadCardProps) {
    return (
        <section className="border h-auto mx-auto p-4 rounded-md shadow-sm min-w-[500px]">
            {title && <header className="mb-6">
                <h1 className="font-medium mb-2">{title}</h1>
            </header>}

            {Content}
        </section >
    )
}
