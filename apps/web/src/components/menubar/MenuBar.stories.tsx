import type { Meta, StoryObj } from '@storybook/react';
import { Edit, Trash2, Copy } from 'react-feather'

import { MenuBar, MenuItem, Separator } from './MenuBar';

const meta: Meta<typeof MenuBar> = {
    title: 'Components/Menubar',
    component: MenuBar
};

export default meta;
type Story = StoryObj<typeof MenuBar>;

export const Default: Story = {
    args: {
        trigger: 'Frameworks',
        triggerProps: { className: 'outline outline-gray-200 transition hover:bg-gray-100 px-2 py-1 rounded-md data-[state=open]:bg-gray-200' },
        children: (
            <>
                <MenuItem>React</MenuItem>
                <MenuItem>Vue</MenuItem>
                <MenuItem>Svelte</MenuItem>
            </>
        ),
    }
};

export const WithIcons: Story = {
    args: {
        trigger: 'Actions',
        triggerProps: { className: 'outline outline-gray-200 transition hover:bg-gray-100 px-2 py-1 rounded-md data-[state=open]:bg-gray-200' },
        children: (
            <>
                <MenuItem icon={<Edit size={16} />}>Edit</MenuItem>
                <MenuItem icon={<Copy size={16} />}>Duplicate</MenuItem>
                <MenuItem className="text-red-400 hover:bg-red-50" icon={<Trash2 size={16} />}>Delete</MenuItem>
            </>
        )
    }
}

export const WithDivider: Story = {
    args: {
        trigger: 'Separated Actions',
        triggerProps: { className: 'outline outline-gray-200 transition hover:bg-gray-100 px-2 py-1 rounded-md data-[state=open]:bg-gray-200' },
        children: (
            <>
                <MenuItem icon={<Edit size={16} />}>Edit</MenuItem>
                <Separator />
                <MenuItem icon={<Copy size={16} />}>Duplicate</MenuItem>
                <MenuItem className="text-red-400 hover:bg-red-50" icon={<Trash2 size={16} />}>Delete</MenuItem>
            </>
        )
    }
}