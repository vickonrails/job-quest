import * as React from 'react';

import { type Size, cn, getSize } from 'shared';
import { Label } from './label';

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
  containerProps?: React.HTMLAttributes<HTMLDivElement>
}

// TODO: use the cva variant library here
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, fullWidth, containerProps, size = 'md', label, disabled, hint, ...rest }, ref) => {
    const id = React.useId()
    return (
      <div {...containerProps}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <input
          id={id}
          type={type}
          className={cn(
            cn(
              'border block bg-inherit text-accent-foreground rounded-lg px-3.5 w-full mb-1 active:border-primary shadow-light focus-visible:outline-primary focus-visible:outline-1',
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
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input };

