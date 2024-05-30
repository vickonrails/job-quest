
import { useId } from 'react'
import { Label } from './label'
import {
    SelectContent,
    SelectGroup,
    SelectItem,
    Select as SelectRoot,
    SelectTrigger,
    SelectValue
} from './select-primitives'

export function Select({ options, label, trigger, size = 'md', ...props }: SelectProps) {
    const selectedOption = options?.find((option) => option.value === props.value)
    const id = useId()

    return (
        <SelectRoot {...props}>
            <label>
                {label && <Label htmlFor={id}>{label}</Label>}
                <SelectTrigger className={SIZE_MAP[size]} id={id}>
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
            </label>
        </SelectRoot>
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
    size?: 'sm' | 'md' | 'lg'
}