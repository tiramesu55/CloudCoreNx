import { ComponentStory, ComponentMeta } from '@storybook/react';
import { IdlePopUp } from './idlePopup';

export default {
  component: IdlePopUp,
  title: 'IdlePopUp',
} as ComponentMeta<typeof IdlePopUp>;

const Template: ComponentStory<typeof IdlePopUp> = (args) => (
  <IdlePopUp {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  isOpen: true,
  minutes: 1,
  seconds: 0,
  timer: {
    minutes: 1,
    seconds: 0,
  },
};
