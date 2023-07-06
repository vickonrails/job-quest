import { type FC, type HTMLAttributes } from 'react'
import clsx from 'clsx'
import { type Size, getSize } from '../utils'

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
    const isFullWidth = clsx(fullWidth && 'tw-w-full');
    return (
        <button
            className={clsx(
                'tw-bg-primary tw-hover:bg-primary-light tw-transition-colors tw-rounded-lg tw-text-white tw-py-2 tw-px-3.5 tw-font-medium',
                isFullWidth,
                size && getSize(size),
                disabled ? 'tw-opacity-50 tw-cursor-not-allowed' : 'tw-cursor-pointer',
                loading && 'tw-pointer-events-none',
                className
            )}
            disabled={disabled}
            {...rest}>
            {loading ? (<div>
                {/* <Spinner variant='secondary' /> */}
                <Spinner />
            </div>) : children}
        </button>
    )
}

// TODO: Add different button variants
// TODO: Button with icons

const Spinner = () => (
    <>Spinner</>
)