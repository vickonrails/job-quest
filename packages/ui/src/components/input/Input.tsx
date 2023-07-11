import { type InputHTMLAttributes, type FC } from "react"
import clsx from 'clsx'
import { type Size, getSize } from "../utils"

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    /**
     * 
     */
    label?: string

    /**
     * 
     */
    name?: string
    // provide hint color based on the state of the field
    hint?: string
    fullWidth?: boolean

    /** size of the input */
    size?: Size
}

/** Input component - for taking user's input */
export const Input: FC<InputProps> = ({ label, name, hint, className, disabled, size = 'md', fullWidth, ...rest }) => {
    return (
        <div className={clsx(fullWidth ? 'tw-w-full' : 'tw-w-60', 'tw-mb-2')}>
            <label>
                <span className="tw-block tw-m-1.5 tw-text-sm tw-text-gray-600 tw-select-none">{label}</span>
                <input className={
                    clsx(
                        'tw-border tw-block tw-rounded-lg tw-px-3.5 tw-w-full tw-mb-1 tw-active:border-primary tw-shadow-light',
                        fullWidth && 'w-full',
                        size && getSize(size),
                        disabled && 'tw-pointer-events-none',
                        className,
                    )
                } id={name} disabled={disabled} {...rest} />
            </label>

            {hint && <span className="tw-text-sm tw-block tw-text-gray-400 tw-px-2" data-testid='hint'>{hint}</span>}
        </div>
    )
}

// TODO: input with icon
// TODO: support for password input