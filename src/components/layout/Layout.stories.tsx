import type { Meta, StoryObj } from '@storybook/react';

import { Layout, type LayoutProps } from './Layout';
import { type Session } from '@supabase/supabase-js';
import { Typography } from '@components/typography';
import { type Profile } from 'lib/types';

const meta: Meta<LayoutProps> = {
    title: 'Components/Layout',
    component: Layout,
    args: {},
};

export default meta;
type Story = StoryObj<LayoutProps>;

const session = {
    user: {
        email: "johnDoe@gmail.com"
    }
} as Session

const profile = {
    username: 'John Doe'
} as Profile

export const Default: Story = {
    args: {
        children: <Typography as='h1' variant='display-xs-md'>Welcome Victor...</Typography>,
        session,
        profile
    },
    parameters: {
        layout: 'fullscreen'
    }
};