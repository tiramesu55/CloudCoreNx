import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UserMenu } from './UserMenu';

export default {
  component: UserMenu,
  title: 'UserMenu',
} as ComponentMeta<typeof UserMenu>;

const Template: ComponentStory<typeof UserMenu> = (args) => (
  <UserMenu {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
