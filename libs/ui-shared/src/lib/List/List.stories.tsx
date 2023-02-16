import { ComponentStory, ComponentMeta } from '@storybook/react';
import { List } from './List';

export default {
  component: List,
  title: 'List',
  argTypes: {
    changeSelectedId: { action: 'changeSelectedId executed!' },
  },
} as ComponentMeta<typeof List>;

const Template: ComponentStory<typeof List> = (args) => <List {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: 'Organization',
  name: 'name',
  idSelected: 'test1',
  data: [
    {
      name: 'Test',
      description: 'Testing',
      orgDomains: ['test.com'],
      address: {
        street: '12 Maple st',
        city: 'Miami',
        zip: '77479',
        state: 'TX',
      },
      id: 'test',
      inactiveDate: null,
    },
    {
      name: 'Test 1',
      description: 'Testing',
      orgDomains: ['test.com'],
      address: {
        street: '5304 claridge square',
        city: 'Atlanta',
        zip: '30338',
        state: 'Georgia',
      },
      id: 'test1',
      inactiveDate: null,
    },
  ],
};
