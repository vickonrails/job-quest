import * as RadixMenuBar from '@radix-ui/react-menubar'
import clsx from 'clsx';
import { type FC } from 'react';

interface MenuBarProp extends RadixMenuBar.MenubarProps {
    trigger: React.ReactNode
    triggerProps?: RadixMenuBar.MenubarTriggerProps
}

// TODO: fix x index
function MenuBar({ trigger, triggerProps, children, ...rest }: MenuBarProp) {
    const { className } = triggerProps ?? {}
    return (
        <RadixMenuBar.Root className="text-base-col" {...rest}>
            <RadixMenuBar.Menu>
                <RadixMenuBar.Trigger
                    className={clsx(className)}
                    {...triggerProps}
                >
                    {trigger}
                </RadixMenuBar.Trigger>
                <RadixMenuBar.Portal>
                    <RadixMenuBar.Content className="bg-white rounded-md p-2 min-w-[15px] shadow-sm border-solid border border-gray-100 mt-1 text-light-text">
                        {children}
                    </RadixMenuBar.Content>
                </RadixMenuBar.Portal>
            </RadixMenuBar.Menu>
        </RadixMenuBar.Root>
    );

}
type MenuItemProps = RadixMenuBar.MenuItemProps & {
    icon?: React.ReactNode
}

const MenuItem: FC<MenuItemProps> = ({ icon, className, children, ...rest }) => {
    // TODO: add variant prop for menu Item
    return (
        <RadixMenuBar.Item
            className={clsx('transition text-sm px-2 py-1 flex items-center rounded-md hover:bg-gray-100 hover:cursor-pointer', className)}
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
export { MenuBar, MenuItem, Separator }