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

export const Multiline: Story = {
    args: {
        placeholder: 'Multiline Input',
        multiline: true,
        label: 'Multiline input',
        hint: 'This is nothing but a maaad joke',
    }
}

export const Disabled: Story = {
    args: {
        disabled: true,
        placeholder: 'Disabled Input',
        label: 'Disabled Input'
    }
}

export const Sizes = () => (
    <>
        <Input size="xs" label="extra small" placeholder="Nothing but a maaad joke" />
        <Input size="sm" label="Small" placeholder="Nothing but a maaad joke" />
        <Input size="md" label="Medium" placeholder="Nothing but a maaad joke" />
        <Input size="lg" label="Large" placeholder="Nothing but a maaad joke" />
    </>
)