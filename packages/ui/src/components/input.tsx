import * as React from "react";

import { cn, getSize } from "../utils";

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
  hint?: React.ReactNode
  fullWidth?: boolean

  /** size of the input */
  size?: Size

  multiline?: boolean
}

// TODO: use the cva variant library here
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, fullWidth, size = 'md', label, disabled, hint, ...rest }, ref) => {
    return (
      <>
        <label>
          <span className="block m-1.5 text-sm text-gray-500 select-none">{label}</span>
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
            disabled={disabled}
            ref={ref}
            {...rest}
          />
          {hint && <span className="text-sm block text-gray-400 px-2" data-testid="hint">{hint}</span>}
        </label>
      </>
    )
  }
)
Input.displayName = "Input"

export { Input };

