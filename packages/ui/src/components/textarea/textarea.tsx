import { cn } from 'shared'
import * as React from 'react'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string, containerClasses?: string }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClasses, label, ...props }, ref) => {
    return (
      <label className={cn('block', containerClasses)}>
        <span className="block m-1.5 text-sm text-gray-500 select-none">{label}</span>
        <textarea
          className={cn(
            'flex min-h-[80px] bg-inherit text-accent-foreground w-full rounded-md border border-input px-3 py-2 text-sm placeholder:text-muted-foreground active:border-primary disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-primary focus-visible:outline-1',
            className
          )}
          rows={1}
          ref={ref}
          {...props}
        />
      </label>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
