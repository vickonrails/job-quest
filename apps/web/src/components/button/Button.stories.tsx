import type { Meta, StoryObj } from '@storybook/react';

import { Button, type ButtonProps } from './Button';

const meta: Meta<ButtonProps> = {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
    args: {},
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const Default: Story = {
    args: {
        children: 'Default Button',
    }
};

export const Loading: Story = {
    args: {
        children: 'Button',
        loading: true
    },
};

export const FillTypes = () => (
    <div style={{
        display: 'flex',
        gap: 20
    }}>
        <Button fillType="filled">Filled Button</Button>
        <Button fillType="outlined">Outlined Button</Button>
        <Button fillType="text">Text Button</Button>
    </div>
)

export const Disabled: Story = {
    args: {
        children: 'Disabled Button',
        disabled: true
    },
};
