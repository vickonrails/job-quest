import { cn } from '@utils/cn'
import React, { type HTMLAttributes } from 'react'

export function ErrorHint({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={cn('text-sm text-red-500', className)} {...rest} />
    )
}
