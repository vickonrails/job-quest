import { X } from 'lucide-react'
import { type HTMLAttributes } from 'react'
import { cn } from 'shared'

// TODO: refactor chips not to use native CSS colors
export type ChipVariants = 'blue' | 'purple' | 'green' | 'gold' | 'orange' | 'plain'
interface ChipProps extends HTMLAttributes<Omit<HTMLElement, 'children'>> {
    label: string
    variant?: ChipVariants
    onCloseClick?: () => void
}

/** Chip component */
export const Chip = ({ label, variant = 'plain', onCloseClick, className, ...rest }: ChipProps) => {
    const showCloseBtn = Boolean(onCloseClick);

    return (
        <div className={cn(
            'px-3 py-1.5 bg-muted text-muted-foreground inline-flex items-center gap-1 mb-2 rounded-full min-w-14 font-medium text-sm mr-2 text-center',
            'chip',
            variant,
            className
        )}
            data-testid="chip"
            {...rest}
        >
            <span className="w-full select-none">
                {label}
            </span>

            {showCloseBtn && (
                <button type="button" onClick={onCloseClick}>
                    <X size={16} aria-label="Remove" className="text-gray-500" />
                </button>
            )}
        </div>
    )
}

type ChipsGroups = { labels: { label: string, onCloseClick?: () => void }[] }

export const ChipsGroup = ({ labels }: ChipsGroups) => {
    return (
        <div className="flex">
            {labels.map((singleLabel, index) => {
                const { label, onCloseClick } = singleLabel
                return (
                    <Chip
                        key={index}
                        label={label}
                        // variant={hashColors(label) as ChipVariants}
                        onCloseClick={onCloseClick}
                    />
                )
            })}
        </div>
    )
}