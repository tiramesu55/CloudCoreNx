import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DisplayMaintenance } from './displayMaintenance';

export default {
  component: DisplayMaintenance,
  title: 'DisplayMaintenance',
  argTypes: {
    handleDisplayMaintenanceDialog: {
      action: 'handleDisplayMaintenanceDialog executed!',
    },
    ignoreMaintenance: { action: 'ignoreMaintenance executed!' },
    maintenanceStartDate: { control: 'date' },
    maintenanceEndDate: { control: 'date' },
  },
} as ComponentMeta<typeof DisplayMaintenance>;

const Template: ComponentStory<typeof DisplayMaintenance> = (args) => (
  <DisplayMaintenance {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  open: true,
  maintenanceStartDate: '',
  maintenanceEndDate: '',
  maintenanceReason: '',
  fullLockout: false,
  mainApp: false,
  underMaintenance: false,
  bypassUser: false,
  application: '',
};
