import React, { type ReactNode } from 'react';
import * as Tabs from '@radix-ui/react-tabs';

export function JobSheetTabs({ children, rootClassName }: { children: ReactNode, rootClassName?: string }) {
    return (
        <Tabs.Root defaultValue="basic-info" className={rootClassName}>
            <Tabs.List className="flex flex-row gap-4 border-b">
                <Tabs.Trigger value="basic-info" className="uppercase text-sm select-none pb-2 text-muted-foreground border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary">
                    Basic Info
                </Tabs.Trigger>
                <Tabs.Trigger value="description" className="uppercase text-sm select-none pb-2 text-muted-foreground border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary">
                    Description
                </Tabs.Trigger>
            </Tabs.List>
            {children}
        </Tabs.Root>
    )
}