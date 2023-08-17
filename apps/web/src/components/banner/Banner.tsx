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
                'text-left border text-primary-dark px-3 py-2 rounded-lg block mb-5',
                variant === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
            )
        } {...rest}>
            {message}
        </span>
    )
}
