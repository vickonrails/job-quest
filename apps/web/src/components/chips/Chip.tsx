import { cn } from '@utils/cn'
import hashColors from '@utils/hash-colors'
import React, { type HTMLAttributes } from 'react'

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

const ChipsGroup = ({ labels }: { labels: string[] }) => {
    return (
        <div className="flex">
            {labels.map((label, index) => (
                <Chip key={index} label={label} variant={hashColors(label) as ChipVariants} />
            ))}
        </div>
    )
}

export { Chip, ChipsGroup }