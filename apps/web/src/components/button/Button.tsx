import { type ButtonHTMLAttributes, type FC } from 'react'
import clsx from 'clsx'
import { type Size, getSize } from '@components/utils';

type FillType = 'filled' | 'outlined' | 'text';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** specifies if the button should fill all horizontal space */
    fullWidth?: boolean
    /** size of button */
    size?: Size
    /** specifies loading state */
    loading?: boolean
    /** specifies if button is disabled */
    disabled?: boolean
    /** specifies button variant */
    fillType?: FillType
}

const getFillType = (variant: FillType) => {
    switch (variant) {
        case 'filled':
            return 'bg-primary transition-colors text-white hover:bg-primary-light'

        case 'outlined':
            return 'border border-grey-200 text-primary hover:border-primary-light active:border-primary-light focus:border-primary-light'

        case 'text':
            return 'tw-text-light-text hover:bg-purple-50 focus:bg-purple-100'
    }
}

/**
 * Button component - handles clickable actions
 */
export const Button: FC<ButtonProps> = ({ children, fillType = 'filled', fullWidth, size = 'md', className, disabled, loading, ...rest }) => {
    const isFullWidth = clsx(fullWidth && 'w-full');
    return (
        <button
            className={clsx(
                'font-medium rounded-lg transitions',
                getFillType(fillType),
                isFullWidth,
                size && getSize(size),
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                loading && 'pointer-events-none',
                className
            )}
            disabled={disabled}
            {...rest}>
            {loading ? (<div>
                <p data-testid="spinner">Loading...</p>
            </div>) : children}
        </button>
    )
}

// TODO: Add different button variants
// TODO: Button with icons
