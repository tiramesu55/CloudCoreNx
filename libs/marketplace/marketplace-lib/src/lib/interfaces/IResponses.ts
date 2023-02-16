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
    assocPharmacyId: number;
    assocPharmacyName: string;
  }
  export interface IDashboardContractedRX extends IDashboardDetailsPartner {
    contractedRx: number;
  }
  export interface IDashboardRXFilled extends IDashboardDetailsPartner {
    filledRx: number;
  } 
  export interface IDashboardAvailableRx extends IDashboardDetailsPartner {
    availableRx: number;
  }      
  export interface IDashboardDetails {
    pharmacyId: number;
    facilityId: number;
    association: {
      totalAssociatedPharmacies: number;
      assocPharmacies: IDashboardDetailsPartner[];
    };      
    contractedRx: {    
      totalContractedRxs: number;
      contractedRxs: IDashboardContractedRX[];
    };  
    filledRx: {
      totalRxsFilled: number;
      filledRxs: IDashboardRXFilled[];
    };
    availableRx: {
        totalRxsAvailable: number;
        availableRxs: IDashboardAvailableRx[];
      };
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
