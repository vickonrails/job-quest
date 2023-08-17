import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from './Avatar';

type AvatarProps = typeof Avatar;
const meta: Meta<AvatarProps> = {
    title: 'Components/Avatar',
    component: Avatar,
    tags: [],
    args: {},
};


export default meta;
type Story = StoryObj<AvatarProps>;

export const Default: Story = {
    args: {
        src: 'https://avatars.githubusercontent.com/u/24235881?v=4',
    }
};

