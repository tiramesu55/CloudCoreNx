import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Snackbar } from './Snackbar';

export default {
  component: Snackbar,
  title: 'Snackbar',
  argTypes: {
    onClose: { action: 'onClose executed!' },
  },
} as ComponentMeta<typeof Snackbar>;

const Template: ComponentStory<typeof Snackbar> = (args) => (
  <Snackbar {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  content: 'Success',
  open: true,
  duration: 0,
  type: 'success',
};
