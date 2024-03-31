import { type HTMLAttributes } from 'react'
import { cn } from 'shared'

export function ErrorHint({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={cn('text-sm text-red-500', className)} {...rest} />
    )
}
