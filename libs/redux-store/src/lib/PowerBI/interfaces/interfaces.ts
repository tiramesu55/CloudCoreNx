export enum ActionType{
  //----------------Alert---------------------------------------
     SET_OPEN = 'SET_OPEN',
     SET_CLOSE = 'SET_CLOSE',
  //----------------Config--------------------------------------
     SET_CONFIG = 'SET_CONFIG',
  //----------------Loading-------------------------------------
     SET_LOADING_REPORTS = "SET_LOADING_REPORTS",
     SET_LOADING_REPORT_SINGLE = 'SET_LOADING_REPORT_SINGLE',
  //------------reports ------------------------------
     SET_REPORTS = "SET_REPORTS",
     SELECT_REPORT = "SELECT_REPORT",
     SET_SLICER_FILTER = "SET_SLICER_FILTER"
}

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