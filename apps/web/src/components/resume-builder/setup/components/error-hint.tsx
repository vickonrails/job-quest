import { type HTMLAttributes } from 'react'
import { cn } from 'shared'

export function ErrorHint({ className, children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
    if (!children) return
    return (
        <p className={cn('text-sm text-red-500', className)} {...rest}>
            {children}
        </p>
    )
}
