import { ComponentStory, ComponentMeta } from '@storybook/react';
import { InfoCard } from './InfoCard';
import { users_img } from '@cloudcore/ui-shared';

export default {
  component: InfoCard,
  title: 'InfoCard',
} as ComponentMeta<typeof InfoCard>;

const Template: ComponentStory<typeof InfoCard> = (args) => (
  <InfoCard {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  title: 'Users',
  count: 10,
  image: users_img,
};
