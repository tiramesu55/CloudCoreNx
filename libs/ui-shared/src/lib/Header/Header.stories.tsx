import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Header } from './Header';
import { MemoryRouter } from 'react-router-dom';
import { nexia_logo_img, sign_out_img } from '@cloudcore/ui-shared';
import { useState } from 'react';

export default {
  component: Header,
  title: 'Header',
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = (args) => {
  return <Header {...args} />;
};
export const Primary = Template.bind({});

Primary.args = {
  title: 'Platform Management',
  logo: { img: nexia_logo_img },
  isMainApp: true,
  appsMenu: {
    appsData: [
      {
        name: 'Enterprise Analytics',
        url: '/analytics',
        permission: true,
        appCode: 'analytics',
        defaultApp: true,
        markAsDefaultApp: (e: any) => {
          e.preventDefault;
        },
      },
      {
        name: 'Marketplace',
        url: '/marketplace/',
        permission: true,
        appCode: 'marketplace',
        defaultApp: false,
        markAsDefaultApp: () => {},
      },
    ],
    defaultAppStatus: 'success',
  },
  navLinkMenuList: [
    {
      label: 'Dashboard',
      route: 'path',
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        return;
      },
    },
    {
      label: 'Users',
      route: `user`,
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        return;
      },
    },
    {
      label: 'Configuration',
      subMenuList: [
        {
          label: 'Inventory Settings',
          route: ``,
        },
        { label: 'Label Setting', route: `` },
      ],
    },
  ],
  userMenu: {
    userName: 'Dev Admin',
    userInitials: 'DA',
  },
  maintenance: {
    handleMaintenanceDialog: () => {},
    showMaintenance: true,
  },
  userMenuList: [
    {
      icon: sign_out_img,
      label: 'Logout',
      onClick: () => {
        return;
      },
    },
  ],
};
Primary.parameters = {
  controls: { exclude: ['isFormModified', 'unSavedData'] },
};
