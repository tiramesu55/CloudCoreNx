import { ComponentStory, ComponentMeta } from '@storybook/react';
import ReportIssue from './ReportIssue';

export default {
  component: ReportIssue,
  title: 'ReportIssue',
} as ComponentMeta<typeof ReportIssue>;

const Template: ComponentStory<typeof ReportIssue> = (args) => (
  <ReportIssue {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
