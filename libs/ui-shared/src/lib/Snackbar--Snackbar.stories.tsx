import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Snackbar } from './Snackbar';

export default {
  component: Snackbar,
  title: 'Snackbar',
} as ComponentMeta<typeof Snackbar>;

const Template: ComponentStory<typeof Snackbar> = (args) => (
  <Snackbar {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  type: '',
  content: '',
  duration: 0,
  errorReason: '',
};
