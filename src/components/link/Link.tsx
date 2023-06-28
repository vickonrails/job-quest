import clsx from 'clsx'
import NextLink, { type LinkProps as NextLinkProps } from 'next/link'
import { type ReactNode, type FC } from 'react'

export interface LinkProps extends NextLinkProps {
    children: ReactNode
    className?: string
}

export const Link: FC<LinkProps> = ({ className, ...rest }) => {
    return (
        <NextLink className={
            clsx('hover:text-primary', className)
        } {...rest} />
    )
}