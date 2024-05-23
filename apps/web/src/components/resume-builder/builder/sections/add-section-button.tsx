import { ChevronDown } from 'lucide-react'
import { forwardRef } from 'react'
import { Button, type ButtonProps } from 'ui/button'

/**
 * Button to add new sections
 */
export const AddSectionBtn = forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...props }, ref) => {
    return (
        <Button type="button" variant="ghost" {...props} ref={ref}>
            <span className="text-sm text-primary hover:text-primary">{children}</span>
            <ChevronDown size={16} />
        </Button>
    )
})
AddSectionBtn.displayName = 'AddSectionBtn'