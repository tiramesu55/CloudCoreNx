const mockBusinessRules = [
  {
    id: 1,
    rule: 'Accept Same Day Orders',
    helperText:
      'Orders submitted requiring a same-day to customer date witll be rejected',
    value: false,
  },
  {
    id: 2,
    rule: 'Accept Orders Outside Business Hours',
    helperText:
      'Rx recvieved outside of the Central Fill Operating hours will be rejected if the Owner is also configured to reject those orders',
    value: true,
  },
  {
    id: 3,
    rule: 'Accept Orders Received After Fil-By Time',
    helperText:
      "Orders received that can't be filed in time to get them back to the customer will be rejected",
    value: false,
  },
  {
    id: 4,
    rule: 'Accept orders over the Daily Capacity Threshold',
    helperText:
      'Once the contracted daily capacity has been reached the system will reject any orders over that number',
    value: false,
  },
  {
    id: 5,
    rule: 'Accept orders if Systems are Down',
    helperText: 'Orders will be rejected if system is not functional',
    value: false,
  },
  {
    id: 6,
    rule: 'Accept Orders Not on the Formulary List',
    helperText:
      'Orders for NDCs not on the contracually agreed upon formulary list will be rejected',
    value: false,
  },
  {
    id: 7,
    rule: 'Accept Orders with Insufficent Inventory',
    helperText:
      'Orders for NDCs with insufficent on hand inventory will be rejected',
    value: true,
  },
  {
    id: 8,
    rule: 'Allow borrowing of Inventory',
    helperText:
      'Allow inventory to be brorrowed when orders for NDCs with insufficent on hand inventory are requested to ensure they will not be rejected',
    value: true,
  },
  {
    id: 9,
    rule: 'Accept Orders that are above Inventory Borrowing Threshold',
    helperText:
      'Orders for NDCs with insufficent on hand inventory that need quantities above the set borrowing threshold will be rejected',
    value: true,
  },
  {
    id: 10,
    rule: 'Accept Cold Chain Orders',
    helperText:
      'Orders for NDCs listed as cold chain will be accepted or rejected based on configuration',
    value: true,
  },
  {
    id: 11,
    rule: 'Accept Controlled Substance Orders',
    helperText:
      'Orders for NDCs listed as controlled substance will be accepted or rejected based on configuration',
    value: true,
  },
  {
    id: 12,
    rule: 'Accept Partner Orders',
    helperText:
      'This configuration acts as a gate for all other rules. If this rules is turned off orders will be rejected without reading to check against other rules',
    value: false,
  },
];

export default mockBusinessRules;
