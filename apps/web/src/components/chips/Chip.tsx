import clsx from 'clsx'
import React, { type HTMLAttributes } from 'react'

export type ChipVariants = 'blue' | 'purple' | 'green' | 'gold' | 'orange'

interface ChipProps extends HTMLAttributes<Omit<HTMLElement, 'children'>> {
    label: string
    variant?: ChipVariants
}

/** Chip component */
const Chip = ({ label, variant = 'purple', className, ...rest }: ChipProps) => {
    return (
        <div className={clsx('chip', variant, className)} {...rest}>{label}</div>
    )
}

export { Chip }