import type { Meta, StoryObj } from '@storybook/react';

import { Input, type InputProps } from './Input';

const meta: Meta<InputProps> = {
    title: 'Components/Input',
    component: Input,
    tags: ['autodocs'],
    args: {},
};

export default meta;
type Story = StoryObj<InputProps>;

export const Default: Story = {
    args: {
        placeholder: 'Default Input',
        label: 'Default',
        hint: 'This is nothing but a maaad joke',
    }
};

export const Disabled: Story = {
    args: {
        disabled: true,
        placeholder: 'Disabled Input',
        label: 'Disabled Input',
    }
}