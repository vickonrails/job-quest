'use client'

import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { formatToUTC } from 'shared'
import { type SelectSingleEventHandler } from 'react-day-picker'
import { cn } from 'shared'
import { Button } from './button'
import { Calendar, type CalendarProps } from './calendar'
import { Label } from './label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from './popover'

type DatePickerProps = CalendarProps & {
    label?: string
    hint?: string | React.ReactNode
    onChange?: (date: Date | string) => void
    placeholder?: string
}

export function DatePicker({ selected, onChange, hint, label }: DatePickerProps) {
    const [date, setDate] = React.useState<Date | undefined>(selected)
    const [open, setOpen] = React.useState(false)
    const id = React.useId()

    const handleDateChange: SelectSingleEventHandler = (_, selectedDay) => {
        if (!selectedDay) return
        onChange?.(formatToUTC(selectedDay))
        setDate(selectedDay)
        setOpen(false)
    }

    return (
        <div className="flex flex-col">
            {label && <Label htmlFor={id}>{label}</Label>}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        size="lg"
                        onClick={_ => setOpen(true)}
                        variant={'outline'}
                        className={cn(
                            'justify-start text-left font-normal',
                            !date && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        defaultMonth={date}
                        selected={date}
                        onSelect={handleDateChange}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            {hint && <span className="text-xs block pt-2 text-gray-400 px-2" data-testid="hint">{hint}</span>}
        </div>
    )
}
