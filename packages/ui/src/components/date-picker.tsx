'use client'

import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { type SelectSingleEventHandler } from 'react-day-picker'
import { cn } from 'shared'
import { Button } from './button'
import { Calendar, type CalendarProps } from './calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from './popover'
import { Label } from './label'

type DatePickerProps = CalendarProps & {
    label?: string
    hint?: string | React.ReactNode
    onChange?: (date: Date) => void
    placeholder?: string
}

export function DatePicker({ selected, onChange, hint, label, mode = 'single' }: DatePickerProps) {
    const [date, setDate] = React.useState<Date | undefined>(selected)
    const [open, setOpen] = React.useState(false)
    const id = React.useId()

    const handleDateChange: SelectSingleEventHandler = (_, selectedDay) => {
        if (!selectedDay) return;
        onChange?.(selectedDay)
        setDate(selectedDay)
        setOpen(false)
    }

    return (
        <div className="flex flex-col">
            {label && <Label htmlFor={id} className="block m-1.5 font-normal text-sm text-muted-foreground select-none">{label}</Label>}
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
