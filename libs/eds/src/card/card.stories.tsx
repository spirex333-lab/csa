import type { Meta, StoryObj } from '@storybook/react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './index';

const meta = {
  title: 'EDS/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    variant: 'surface',
    padding: 'lg',
    className: 'w-[460px]',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['surface', 'metric', 'auth'],
    },
    padding: {
      control: 'inline-radio',
      options: ['none', 'md', 'lg'],
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Surface: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader className="p-0">
        <CardTitle>Workflow Builder</CardTitle>
        <CardDescription>Default surface card for primary sections.</CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const Metric: Story = {
  args: {
    variant: 'metric',
    padding: 'md',
  },
  render: (args) => (
    <Card {...args}>
      <CardContent className="p-0">
        <p className="text-sm text-slate-600">Execution Engine</p>
        <p className="text-xl font-semibold text-slate-900">Planned</p>
      </CardContent>
    </Card>
  ),
};

export const Auth: Story = {
  args: {
    variant: 'auth',
    padding: 'lg',
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader className="p-0">
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use this card on auth routes.</CardDescription>
      </CardHeader>
    </Card>
  ),
};
