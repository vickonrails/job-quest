import { type InputHTMLAttributes, type FC } from "react"
import clsx from 'clsx'
import { type Size, getSize } from "@components/utils"

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
        <div className={clsx(fullWidth ? 'w-full' : 'w-60')}>
            <label aria-labelledby={name} htmlFor={name} className="block m-1.5 text-sm text-gray-600">{label}</label>
            <input className={
                clsx(
                    'border block rounded-lg px-3.5 w-full mb-1 active:border-primary shadow-light',
                    // fullWidth && 'w-full',
                    size && getSize(size),
                    disabled && 'pointer-events-none',
                    className,
                )
            } id={name} disabled={disabled} {...rest} />
            {hint && <span className="text-sm block text-gray-400 px-2" data-testid='hint'>{hint}</span>}
        </div>
    )
}

// TODO: input with icon
// TODO: support for password input