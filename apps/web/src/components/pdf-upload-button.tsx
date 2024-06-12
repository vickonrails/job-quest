'use client'

import { getFilename } from '@/utils/get-upload-filename';
import { useCallback, useRef, type ChangeEvent } from 'react';
import { Button, type ButtonProps } from 'ui/button';

interface PDFUploadButtonProps extends ButtonProps {
    onFilePicked?: (file: ArrayBuffer) => void
}

export function PDFUploadButton({ onFilePicked, onClick, ...rest }: PDFUploadButtonProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    const onChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
        const file = ev.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = (evt) => {
            const result = evt.target?.result;
            const filename = getFilename(file.name) // ???
            onFilePicked?.(result as ArrayBuffer)
            if (inputRef.current) inputRef.current.value = '';

            // make request to backend with file buffer
            console.log({ result, filename })
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
                accept=".pdf"
                className="hidden"
            />
            <Button onClick={handleClick} {...rest}>Upload PDF Now</Button>
        </>
    )
}