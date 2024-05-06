import { Popover } from '@components/popover';
import { format, isValid } from 'date-fns';
import { Calendar } from 'lucide-react';
import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { DayPicker as DefaultDayPicker, useDayRender, type DayPickerDefaultProps, type DayProps, type SelectSingleEventHandler } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { cn } from 'shared';

interface DayPickerProps extends DayPickerDefaultProps {
    label?: string
    hint?: string | ReactNode
    onChange?: (date: Date) => void
    placeholder?: string
    value?: Date | null
}

export function DatePicker({ label, hint, value, onChange, placeholder, ...rest }: DayPickerProps) {
    const [selected, setSelected] = useState<Date | null | undefined>(value);
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const handler = () => {
            setOpen(true)
        }
        const ref = inputRef.current;
        ref?.addEventListener('focus', handler)
        return () => {
            ref?.removeEventListener('focus', handler)
        }
    }, [])

    const handleDateChange: SelectSingleEventHandler = (day, selectedDay) => {
        const isValidDate = isValid(selectedDay);
        if (!selectedDay) return;
        if (!selectedDay || !isValidDate) return;
        onChange?.(selectedDay)
        setSelected(selectedDay)
        setOpen(false);
    }

    const handleChange = () => {
        // 
    }

    const formattedDate = selected ? format(selected, 'dd-MM-y') : ''
    const formattedValue = selected ? new Date(selected) : undefined

    return (
        <label data-testid="date-picker">
            <span className="block m-1.5 text-sm text-gray-500 select-none">{label}</span>
            <div className="relative">
                <input
                    ref={inputRef}
                    placeholder={placeholder}
                    data-testid="date-picker-input"
                    // defaultValue={formattedDate}
                    onChange={handleChange}
                    value={formattedDate}
                    className="border bg-inherit text-accent-foreground rounded-lg px-3.5 py-2 w-full mb-1 active:border-primary shadow-light focus-visible:outline-primary focus-visible:outline-1"
                />
                <Popover
                    open={open}
                    onOpenChange={setOpen}
                    Trigger={(
                        <button type="button" data-testid="date-picker-trigger" className="absolute right-2 top-3">
                            <Calendar className="text-muted-foreground w-" size={20} />
                        </button>
                    )}
                    contentProps={{
                        side: 'bottom',
                        align: 'end',
                        sideOffset: 12,
                        className: 'w-full p-0'
                    }}
                >
                    <DefaultDayPicker
                        captionLayout="dropdown"
                        fromYear={1880}
                        toYear={new Date().getFullYear()}
                        mode="single"
                        className="date-picker-wrapper"
                        data-testid="date-picker-popover"
                        selected={formattedValue}
                        onSelect={handleDateChange}
                        defaultMonth={formattedValue}
                        components={{ Day, Footer }}
                        modifiersClassNames={{
                            selected: 'selected',
                            today: 'today'
                        }}
                        {...rest}
                    />
                </Popover>
                {hint && <span className="text-sm block text-gray-400 px-2" data-testid="hint">{hint}</span>}
            </div>
        </label>
    )
}

function Day({ date, displayMonth }: DayProps) {
    const buttonRef = React.createRef<HTMLButtonElement>();
    const dayRenderProps = useDayRender(date, displayMonth, buttonRef)
    const { className, ...restButtonProps } = dayRenderProps.buttonProps

    if (dayRenderProps.isHidden) {
        return (
            <button type="button" disabled={dayRenderProps.isHidden} className="hover:bg-muted rounded-full h-8 w-8 text-sm disabled:pointer-events-none disabled:text-neutral-300">{date.getDate()}</button>
        )
    }

    return (
        <button type="button" disabled={dayRenderProps.isHidden} ref={buttonRef} className={cn('bg-inherit hover:bg-muted outline-2 outline-primary active:outline focus:outline transition-colors rounded-full h-8 w-8 text-sm', className)} {...restButtonProps}>{date.getDate()}</button>
    )
}

function Footer() {
    return (
        <button type="button">Today</button>
    )
}

Day.displayName = 'Day Component'