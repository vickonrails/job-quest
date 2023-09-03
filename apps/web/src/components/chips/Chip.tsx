import React, { type HTMLAttributes } from 'react'
import { cn } from 'src/utils'

export type ChipVariants = 'blue' | 'purple' | 'green' | 'gold' | 'orange'

interface ChipProps extends HTMLAttributes<Omit<HTMLElement, 'children'>> {
    label: string
    variant?: ChipVariants
}

/** Chip component */
const Chip = ({ label, variant = 'green', className, ...rest }: ChipProps) => {
    return (
        <div className={cn(
            'px-2 py-2 mb-2 rounded-lg font-medium text-sm mr-2 text-center',
            'chip',
            variant,
            className
        )} {...rest}>{label}</div>
    )
}

export { Chip }