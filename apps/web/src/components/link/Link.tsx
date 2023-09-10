import { cn } from '@utils/cn'
import NextLink, { type LinkProps as NextLinkProps } from 'next/link'
import { type ReactNode, type FC } from 'react'

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