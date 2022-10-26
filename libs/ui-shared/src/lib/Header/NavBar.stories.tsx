import { ComponentStory, ComponentMeta } from '@storybook/react';
import NavBar from './NavBar';

export default {
  component: NavBar,
  title: 'NavBar',
} as ComponentMeta<typeof NavBar>;

const Template: ComponentStory<typeof NavBar> = (args) => <NavBar {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
