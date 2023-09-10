import * as React from "react"

import { cn } from "../utils"

export type Size = 'xs' | 'sm' | 'md' | 'lg';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'> {
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

  multiline?: boolean
}

// TODO: move to appropriate file
export function getSize(size: Size) {
  switch (size) {
    case 'xs':
      return 'text-sm p-3 py-2'

    case 'sm':
      return 'py-1.5 text-sm px-2.5'

    case 'lg':
      return 'py-3.5 px-4'

    case 'md':
    default:
      return 'py-2.5 px-3.5'
  }
}

// TODO: use the cva variant library here
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, fullWidth, size = 'md', label, disabled, hint, ...rest }, ref) => {
    return (
      <>
        <label>
          <span className="block m-1.5 text-sm text-gray-600 select-none">{label}</span>
          <input
            type={type}
            className={cn(
              cn(
                'border block rounded-lg px-3.5 w-full mb-1 active:border-primary shadow-light',
                fullWidth && 'w-full',
                size && getSize(size),
                disabled && 'pointer-events-none'
              ),
              className
            )}
            ref={ref}
            {...rest}
          />
        </label>
        {hint && <span className="text-sm block text-gray-400 px-2" data-testid="hint">{hint}</span>}
      </>
    )
  }
)
Input.displayName = "Input"

export { Input }
