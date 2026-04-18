import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './index';

const meta = {
  title: 'EDS/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'ADD NOW',
    variant: 'default',
    disabled: false,
  },
  argTypes: {
    children: {
      control: 'text',
    },
    variant: {
      control: 'inline-radio',
      options: ['default', 'secondary', 'ghost'],
    },
    disabled: {
      control: 'boolean',
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomLabel: Story = {
  args: {
    children: 'BOOK NOW',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
