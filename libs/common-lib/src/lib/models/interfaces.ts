// export interface IUiReport {
//     reportId: string;
//     reportName: string;

//   }

export interface IUiReport {
  name: string;
  reports: {
    reportId: string;
    reportName: string;
  }[];
}

export interface IUserInfo {
  name?: string;
  email?: string;
}

export interface ITracker {
  user?: IUserInfo;
  name: string;
  message?: string;
  visualName?: string;
}

export interface IProperties {
  displayName: string;
  email: string;
  message: string;
  visualName?: string;
}

export interface IFilterReport {
  filterItem: string[];
  operator?: string;
}

export interface IErrorTypeResponse {
  type?: string;
  message?: string;
  status?: number;
  messageToShow?: string;
  justEventSend?: boolean;
}