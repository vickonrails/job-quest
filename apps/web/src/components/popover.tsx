import * as RadixPopover from '@radix-ui/react-popover';
import React from 'react';
import { cn } from 'shared';

interface PopoverProps extends RadixPopover.PopoverProps {
    Trigger: React.ReactNode
    contentProps?: RadixPopover.PopoverContentTypeProps
}

export function Popover({ Trigger, children, contentProps }: PopoverProps) {
    const { className: contentClasses, ...restContentProps } = contentProps ?? {}
    return (
        <RadixPopover.Root>
            <RadixPopover.Trigger asChild>
                {Trigger}
            </RadixPopover.Trigger>
            <RadixPopover.Portal>
                <RadixPopover.Content
                    className={cn('w-80 bg-white border p-3 shadow-md rounded-sm', contentClasses)} side="bottom" sideOffset={10}
                    {...restContentProps}
                >
                    {children}
                    {/* <RadixPopover.Close className="PopoverClose" aria-label="Close">
                        <X />
                    </RadixPopover.Close> */}
                    <RadixPopover.Arrow className="PopoverArrow" />
                </RadixPopover.Content>
            </RadixPopover.Portal>
        </RadixPopover.Root>
    );
}