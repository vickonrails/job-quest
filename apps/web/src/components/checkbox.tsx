import React from 'react'
import { Root, Indicator, type CheckboxProps } from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '@utils/cn'
import { v4 as uuid } from 'uuid'

export function Checkbox({ label, className, checked, ...rest }: CheckboxProps & { label: string }) {
    const id = uuid()
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Root className={cn('h-6 border w-6 rounded-md flex transition-colors outline-primary focus:outline', checked ? 'bg-primary' : 'hover:bg-gray-50')} id={id} checked={checked} {...rest}>
                <Indicator className="text-primary-foreground m-auto">
                    <Check size={14} />
                </Indicator>
            </Root>
            <label htmlFor={id} className="text-sm text-muted-foreground">
                {label}
            </label>
        </div>
    )
}
