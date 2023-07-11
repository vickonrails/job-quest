import clsx from 'clsx'
import { type FC, type HTMLAttributes } from 'react'

interface BannerProps extends HTMLAttributes<HTMLSpanElement> {
    message: string
    variant?: 'error' | 'success'
}

// TODO: add accessibility support
export const Banner: FC<BannerProps> = ({ message, variant = 'error', ...rest }) => {
    return (
        <span className={
            clsx(
                'tw-text-left tw-border tw-text-primary-dark tw-px-3 tw-py-2 tw-rounded-lg tw-block tw-mb-5',
                variant === 'success' ? 'tw-bg-green-50 tw-border-green-200 tw-text-green-800' : 'tw-bg-red-50 tw-border-red-200 tw-text-red-800'
            )
        } {...rest}>
            {message}
        </span>
    )
}
