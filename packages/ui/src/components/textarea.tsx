import { Label } from './label'
import * as React from 'react'

import { cn } from 'shared'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  containerProps?: React.HTMLAttributes<HTMLDivElement>
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, containerProps, ...props }, ref) => {
    const id = React.useId()
    return (
      <div {...containerProps}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <textarea
          id={id}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground active:border-primary shadow-light focus-visible:outline-primary focus-visible:outline-1 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
