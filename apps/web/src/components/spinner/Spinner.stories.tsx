import type { Meta, StoryObj } from '@storybook/react';

import Spinner, { type SpinnerProps } from './Spinner';

const meta: Meta<SpinnerProps> = {
    title: 'Components/Spinner',
    component: Spinner,
    args: {},
};

export default meta;
type Story = StoryObj<SpinnerProps>;

export const Default: Story = {};