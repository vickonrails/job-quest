import * as RadixMenuBar from '@radix-ui/react-menubar'
import { type FC } from 'react';

interface MenuBarProp extends RadixMenuBar.MenubarProps {
    trigger: React.ReactNode
}

// TODO: fix x index
const MenuBar: FC<MenuBarProp> = ({ trigger, children, ...rest }) => (
    <RadixMenuBar.Root className="text-base-col">
        <RadixMenuBar.Menu>
            <RadixMenuBar.Trigger>
                {trigger}
            </RadixMenuBar.Trigger>
            <RadixMenuBar.Portal>
                <RadixMenuBar.Content className="bg-white rounded-md p-2 min-w-150 shadow-sm border-solid border border-gray-100">
                    {children}
                </RadixMenuBar.Content>
            </RadixMenuBar.Portal>
        </RadixMenuBar.Menu>
    </RadixMenuBar.Root>
);

type MenuItemProps = RadixMenuBar.MenuItemProps & {
    icon?: React.ReactNode
}
const MenuItem: FC<MenuItemProps> = ({ icon, children, ...rest }) => {
    return (
        <RadixMenuBar.Item
            className="text-sm px-2 py-1 flex items-center rounded-md hover:bg-purple-50 hover:cursor-pointer " {...rest}
        >
            <span className="mr-2">{icon}</span>
            <span>{children}</span>
        </RadixMenuBar.Item>
    )
}
const Separator = () => (
    <RadixMenuBar.Separator className="bg-gray-100 h-[1px]" />
)
export { MenuBar, MenuItem, Separator }