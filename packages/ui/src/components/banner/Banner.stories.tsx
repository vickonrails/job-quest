import type { Meta, StoryObj } from '@storybook/react';

import { Banner } from './Banner';
type BannerProps = typeof Banner;
const meta: Meta<BannerProps> = {
    title: 'Components/Banner',
    component: Banner,
    tags: ['autodocs'],
    args: {},
};

export default meta;
type Story = StoryObj<BannerProps>;

export const Default: Story = {
    args: {
        message: 'This is a default banner',
        variant: 'success',
    }
};

export const Error: Story = {
    args: {
        message: 'This is an error banner',
        variant: 'error',
    }
}