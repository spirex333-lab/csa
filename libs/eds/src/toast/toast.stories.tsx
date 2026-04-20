import type { Meta, StoryObj } from '@storybook/react';
import { Toaster } from '@workspace/ui/toast';
import { toast } from './index';

const meta: Meta = {
  title: 'EDS/Toast',
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};
export default meta;

type Story = StoryObj;

export const Success: Story = {
  render: () => (
    <button
      className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
      onClick={() => toast.success('Order created successfully')}
    >
      Show success toast
    </button>
  ),
};

export const Error: Story = {
  render: () => (
    <button
      className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white"
      onClick={() => toast.error('Something went wrong')}
    >
      Show error toast
    </button>
  ),
};

export const Info: Story = {
  render: () => (
    <button
      className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white"
      onClick={() => toast.info('Rate updated')}
    >
      Show info toast
    </button>
  ),
};
