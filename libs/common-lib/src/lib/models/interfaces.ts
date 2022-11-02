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
    reportId: string;
    reportName: string;
  }

export interface IUiReportList {
  name: string;
  reports: IUiReport[];
}

export interface IUserInfo {
  name?: string;
  email?: string;
}

export interface ITracker {
  user?: IUserInfo;
  name: string;
  message?: string;
  reportInfo?: IUiReport;
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

