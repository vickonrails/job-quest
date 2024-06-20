
import { type ComponentProps, useId } from 'react'
import { cn } from 'shared'
import { Label } from './label'
import {
    SelectContent,
    SelectGroup,
    SelectItem,
    Select as SelectRoot,
    SelectTrigger,
    SelectValue
} from './select-primitives'

export function Select({ options, label, triggerProps, trigger, hint, size = 'md', ...props }: SelectProps) {
    const selectedOption = options?.find((option) => option.value === props.value)
    const id = useId()
    const { className: triggerClassName, ...restTriggerProps } = triggerProps ?? {}

    return (
        <div>
            <SelectRoot {...props}>
                {label && <Label htmlFor={id}>{label}</Label>}
                <SelectTrigger className={cn(SIZE_MAP[size], triggerClassName)} id={id} {...restTriggerProps}>
                    <SelectValue placeholder={selectedOption?.label ?? trigger ?? 'Select an option'} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {options?.map((option) => (
                            <SelectItem key={option.value} value={String(option.value)}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </SelectRoot>
            {hint && <span className="pt-2 text-sm block text-gray-400 px-2" data-testid="hint">{hint}</span>}
        </div>
    )
}

export interface SelectOption {
    value: string | number
    label: string | number
}

const SIZE_MAP = {
    sm: 'py-1',
    md: 'py-2',
    lg: 'py-3',
}

export interface SelectProps extends React.ComponentProps<typeof SelectRoot> {
    options?: SelectOption[]
    trigger?: string
    label?: string
    hint?: React.ReactNode
    size?: 'sm' | 'md' | 'lg'
    triggerProps?: ComponentProps<typeof SelectTrigger>
}