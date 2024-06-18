'use client'

import * as React from 'react'

interface UploadImportProgressProps extends React.HTMLAttributes<HTMLElement> {
    filename: string,
    isUploading: boolean
    children?: React.ReactNode
    LoadingComponent: React.ComponentType<{ filename: string }>
}

export function UploadImportProgress({ filename, isUploading, LoadingComponent, children }: UploadImportProgressProps) {
    if (isUploading) {
        return (
            <LoadingComponent filename={filename} />
        )
    }

    return children ?? null;
}
