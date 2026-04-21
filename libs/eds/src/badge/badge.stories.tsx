import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './index';

const meta: Meta<typeof Badge> = {
  title: 'EDS/Badge',
  component: Badge,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Success: Story = { args: { status: 'success', children: 'Completed' } };
export const Warning: Story = { args: { status: 'warning', children: 'Pending' } };
export const Error: Story = { args: { status: 'error', children: 'Failed' } };
export const Neutral: Story = { args: { status: 'neutral', children: 'Waiting' } };

export const AllStatuses: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge status="success">Completed</Badge>
      <Badge status="warning">Pending</Badge>
      <Badge status="error">Failed</Badge>
      <Badge status="neutral">Waiting</Badge>
    </div>
  ),
};
