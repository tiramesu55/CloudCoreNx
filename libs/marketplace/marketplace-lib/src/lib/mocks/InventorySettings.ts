export interface IPartnerInventorySetting {
  name: string;
  initials: string;
  color?: string;
  borrowing?: boolean;
  percentage?: number;
  isOwner: boolean;
}

export interface IPartnerInventorySettingList {
  data: IPartnerInventorySetting[];
}

const MockInventorySettings: IPartnerInventorySettingList = {
  data: [
    {
      name: 'Green Pharmacy',
      initials: 'GP',
      color: '#008080',
      borrowing: true,
      percentage: 15,
      isOwner: true,
    },
    // {
    //   name: 'New Metro Pharmacy',
    //   initials: 'MP',
    //   borrowing: true,
    //   percentage: 12,
    //   isOwner: true,
    // },
    // { name: 'Getwell Pharmacy', initials: 'GP', isOwner: false },
  ],
};

export default MockInventorySettings;
