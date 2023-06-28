import { type FC, type HTMLAttributes } from 'react'
import clsx from 'clsx'
import { getSize, type Size } from '@components/utils'
import Spinner from '@components/spinner/Spinner'

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
    /** specifies if the button should fill all horizontal space */
    fullWidth?: boolean
    /** size of button */
    size?: Size
    /** specifies loading state */
    loading?: boolean
    /** specifies if button is disabled */
    disabled?: boolean
}

/**
 * Button component - handles clickable actions
 */
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
