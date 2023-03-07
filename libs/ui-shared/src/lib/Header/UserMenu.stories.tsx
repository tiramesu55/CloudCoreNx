import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UserMenu } from './UserMenu';
import { sign_out_img } from '@cloudcore/ui-shared';

export default {
  component: UserMenu,
  title: 'UserMenu',
} as ComponentMeta<typeof UserMenu>;

const Template: ComponentStory<typeof UserMenu> = (args) => (
  <UserMenu {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  userMenuProps: {
    userMenuList: [
      {
        icon: sign_out_img,
        label: 'Logout',
        onClick: () => {
          return;
        },
      },
    ],
    userInitials: 'DA',
    userName: 'Dev Admin',
  },
};
