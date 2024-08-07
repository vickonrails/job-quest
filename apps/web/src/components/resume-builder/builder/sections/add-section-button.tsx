import { ChevronDown } from 'lucide-react'
import { forwardRef } from 'react'
import { Button, type ButtonProps } from 'ui/button'

/**
 * Button to add new sections
 */
export const AddSectionBtn = forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...props }, ref) => {
    return (
        <Button type="button" variant="secondary" {...props} ref={ref}>
            <span className="text-sm">{children}</span>
            <ChevronDown size={16} />
        </Button>
    )
})
AddSectionBtn.displayName = 'AddSectionBtn'