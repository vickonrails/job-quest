'use client'

import { getFilename } from '@/utils/get-upload-filename';
import { useCallback, useRef, type ChangeEvent } from 'react';
import { Button, type ButtonProps } from 'ui/button';
import { type SupportedFormats } from './upload/upload-card';

interface PDFUploadButtonProps extends ButtonProps {
    onFilePicked?: (file: ArrayBuffer, filename: string) => void
    supportedFormats?: SupportedFormats[]
}

export function UploadButton({ onFilePicked, onClick, supportedFormats, children, ...rest }: PDFUploadButtonProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    const onChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
        const file = ev.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        const filename = getFilename(file.name) // ???
        reader.onload = (evt) => {
            const result = evt.target?.result;
            const filename = getFilename(file.name) // ???
            onFilePicked?.(result as ArrayBuffer, filename)
            if (inputRef.current) inputRef.current.value = '';
        }
    }, [onFilePicked])

    const handleClick = useCallback(() => {
        inputRef.current?.click();
    }, [])

    return (
        <>
            <input
                type="file"
                ref={inputRef}
                onChange={onChange}
                // TODO: conform with supported formats
                accept={supportedFormats?.join(',')}
                className="hidden"
            />
            <Button onClick={handleClick} {...rest}>{children}</Button>
        </>
    )
}