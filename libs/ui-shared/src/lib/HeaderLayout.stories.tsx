import { ComponentStory, ComponentMeta } from '@storybook/react';
import { HeaderLayout } from './HeaderLayout';

export default {
  component: HeaderLayout,
  title: 'HeaderLayout',
  argTypes: {
    signOut: { action: 'signOut executed!' },
  },
} as ComponentMeta<typeof HeaderLayout>;

const Template: ComponentStory<typeof HeaderLayout> = (args) => (
  <HeaderLayout {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  title: '',
};
