import NextLink, { type LinkProps as NextLinkProps } from 'next/link'
import { type FC, type ReactNode } from 'react'
import { cn } from 'shared'

export interface LinkProps extends NextLinkProps {
    children: ReactNode
    className?: string
    disabled?: boolean
    title?: string
}

export const Link: FC<LinkProps> = ({ className, disabled, ...rest }) => {
    return (
        <NextLink
            className={
                cn(!disabled && 'hover:text-primary', className)
            }
            {...rest}
        />
    )
}