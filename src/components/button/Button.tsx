import { type FC, type HTMLAttributes } from 'react'
import clsx from 'clsx'
import { getSize, type Size } from '@components/utils'
import Spinner from '@components/spinner/Spinner'

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
    fullWidth?: boolean
    size?: Size
    loading?: boolean
    disabled?: boolean
}

export const Button: FC<ButtonProps> = ({ children, fullWidth, size = 'md', className, disabled, loading, ...rest }) => {
    const isFullWidth = clsx(fullWidth && 'w-full');
    return (
        <button
            className={clsx(
                'bg-primary hover:bg-primary-light transition-colors rounded-lg text-white py-2 px-3.5 font-medium',
                isFullWidth,
                size && getSize(size),
                disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                className
            )} {...rest}>
            {loading ? <div><Spinner variant='secondary' /></div> : children}
        </button>
    )
}

// TODO: Add different button variants
// TODO: Button with icons
