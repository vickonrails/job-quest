import { type InputHTMLAttributes, type FC } from "react"
import clsx from 'clsx'
import { type Size, getSize } from "@components/utils"

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
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

    size?: Size
}

export const Input: FC<InputProps> = ({ label, name, hint, className, size = 'md', fullWidth, ...rest }) => {
    return (
        <div>
            <label className="block m-1.5 text-sm text-gray-600" htmlFor={name}>{label}</label>
            <input className={
                clsx(
                    'border rounded-lg px-3.5 active:border-primary shadow-light',
                    fullWidth && 'w-full',
                    size && getSize(size),
                    className,
                )
            } id={name} {...rest} />
            {hint && <span>{hint}</span>}
        </div>
    )
}