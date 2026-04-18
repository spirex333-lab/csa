import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { Switch } from './index';

const meta = {
  title: 'EDS/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: {
    checked: false,
    disabled: false,
  },
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(Boolean(args.checked));

    React.useEffect(() => {
      setChecked(Boolean(args.checked));
    }, [args.checked]);

    return <Switch {...args} checked={checked} onClick={() => setChecked((prev) => !prev)} />;
  },
};

export const Off: Story = {
  args: {
    checked: false,
  },
};

export const On: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};
