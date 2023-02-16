import { Box, Typography, useTheme } from '@mui/material';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Card } from './Card';
import theme from '../themes';

export default {
  component: Card,
  title: 'Card',
  argTypes: {
    background: { control: 'color' },
    borderColor: { control: 'color' },
  },
  parameters: {},
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />;
export const Primary = Template.bind({});
Primary.args = {
  children: (
    <Box p={4}>
      <Typography variant="h2">Sample Data</Typography>
      <Typography variant="body1">Content...</Typography>
    </Box>
  ),
  variant: 'outlined',
  background: theme.palette.defaultCardBackground.main,
  borderColor: theme.palette.cardBorder.main,
  borderRadius: theme.shape.borderRadius,
};
Primary.parameters = {
  controls: {
    exclude: [
      'sx',
      'elevation',
      'ref',
      'classes',
      'raised',
      'children',
      'square',
    ],
  },
  docs: { source: { type: 'code' } },
};
