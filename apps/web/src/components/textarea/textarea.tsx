import * as React from 'react'

import { cn } from '@utils/cn'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string, containerClasses?: string }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClasses, label, ...props }, ref) => {
    return (
      <label className={cn('block', containerClasses)}>
        <span className="block m-1.5 text-sm text-gray-500 select-none">{label}</span>
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
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
