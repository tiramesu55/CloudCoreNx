//General Interfacess
export interface IApiResponse {
  success: boolean;
  responseMessage: string;
}

export interface IApiResponseId extends IApiResponse {
  id: number;
}

//DashboardDetails Interfaces
export interface IDashboardDetailsPartner {
  partnerId: number;
  partnerName: string;
}

export interface IDashboardContractedRX extends IDashboardDetailsPartner {
  contractedRx: number;
}

export interface IDashboardRXFilled extends IDashboardDetailsPartner {
  rxsFilled: number;
}

export interface IDashboardDetails {
  customerId: number;
  facilityId: number;
  partner: {
    totalPartners: number;
    partners: IDashboardDetailsPartner[];
  };
  contractedRx: {
    totalContractedRxs: number;
    contractedRxs: IDashboardContractedRX[];
  };
  noOfRxsFilled: {
    totalRxsFilled: number;
    rxsFilled: IDashboardRXFilled[];
  };
  dailyUtilization: number;
  totalPendingRxs: number;
}

//InventoryConfiguration Interfaces
export interface IInventoryConfigurationPartner {
  partnerId: number;
  partnerName: string;
  isBorrowing: boolean;
  percentage: number;
}

export interface IInventoryConfiguration {
  customerId: number;
  facilityId: number;
  entityTypeCode: string;
  partner: {
    partners: IInventoryConfigurationPartner[];
  };
}

//ConfigruationData Interfaces
export interface IConfigurationData {
  customerId: number;
  facilityId: number;
  ndc: number;
  shelfQty: number;
  invPool: number;
  configurationData: {
    isAcceptingOrders: boolean;
    dailyRxProcessed: number;
    dailyRxProcessingThreshold: number;
    isPartnerRequestedNDC: boolean;
    isAcceptingSubstanceProducts: boolean;
    isAcceptingColdChainProducts: boolean;
    isAcceptingOrdersAfterRxFillByTime: boolean;
    isAcceptingSameDayOrders: boolean;
    isAcceptingOrdersAfterBusinessHrs: boolean;
  };
}
