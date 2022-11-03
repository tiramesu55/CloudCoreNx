import { ComponentStory, ComponentMeta } from '@storybook/react';
import { InfoCard } from './InfoCard';

export default {
  component: InfoCard,
  title: 'InfoCard',
} as ComponentMeta<typeof InfoCard>;

const Template: ComponentStory<typeof InfoCard> = (args) => (
  <InfoCard {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  title: '',
  count: 0,
  image: '',
  editSites: false,
  orgCode: '',
  orgName: '',
};
