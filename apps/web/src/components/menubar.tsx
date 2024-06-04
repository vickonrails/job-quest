import * as RadixMenuBar from '@radix-ui/react-menubar';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { type FC } from 'react';
import { cn } from 'shared';

interface MenuBarProp extends RadixMenuBar.MenubarProps {
    trigger: React.ReactNode
    triggerProps?: RadixMenuBar.MenubarTriggerProps
    Header?: React.ReactNode
    contentProps?: RadixMenuBar.MenubarContentProps
}

function MenubarHeader({ Header }: { Header: React.ReactNode }) {
    const HeaderCmp = typeof Header === 'string' ? (
        <>
            <div className="text-sm font-semibold p-2 px-4 select-none">{Header}</div>
            <Separator />
        </>
    ) : Header

    return HeaderCmp
}

// TODO: fix z index
// TODO: I might just need to export the containing Content & Trigger to avoid taking children props on the parent
function MenuBar({ trigger, triggerProps, children, contentProps, Header, ...rest }: MenuBarProp) {
    const { className } = triggerProps ?? {}
    const { className: contentClasses, ...restContentProps } = contentProps ?? {}
    return (
        <RadixMenuBar.Root className="text-base-col" {...rest}>
            <RadixMenuBar.Menu>
                <RadixMenuBar.Trigger asChild
                    className={clsx(className)}
                    {...triggerProps}
                >
                    {trigger}
                </RadixMenuBar.Trigger>
                <RadixMenuBar.Portal>
                    <RadixMenuBar.Content
                        className={cn(
                            'bg-white rounded-md p-1 min-w-[15px] shadow-sm border-solid border border-gray-200 mt-1 text-light-text',
                            contentClasses
                        )} {...restContentProps}
                    >
                        {Header && <MenubarHeader Header={Header} />}
                        {children}
                    </RadixMenuBar.Content>
                </RadixMenuBar.Portal>
            </RadixMenuBar.Menu>
        </RadixMenuBar.Root>
    );
}

type MenuItemProps = RadixMenuBar.MenuItemProps & {
    icon?: React.ReactNode
    variant?: 'default' | 'destructive'
}

// TODO: there's a new prop :focus-visible. I also need to cater for this in styling
const menuItemVariants = cva('transition text-sm px-2 py-1 flex items-center rounded-md hover:cursor-pointer', {
    variants: {
        variant: {
            default: 'hover:bg-gray-100',
            destructive: 'text-red-400 hover:bg-red-50 font-medium',
        }
    }
})

// TODO: wanted to use the cva here but I think a better design would be to use it in the content or even the wrapper itself
const MenuItem: FC<MenuItemProps> = ({ icon, className, variant = 'default', children, ...rest }) => {
    return (
        <RadixMenuBar.Item
            className={cn(menuItemVariants({ variant }), className)}
            {...rest}
        >
            <span className="pr-2">{icon}</span>
            <span>{children}</span>
        </RadixMenuBar.Item >
    )
}
const Separator = () => (
    <RadixMenuBar.Separator className="bg-gray-100 h-[1px]" />
)
export { MenuBar, MenuItem, Separator };
