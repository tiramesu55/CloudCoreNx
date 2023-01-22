export enum ActionType {
  //----------------Alert---------------------------------------
  SET_OPEN = 'SET_OPEN',
  SET_CLOSE = 'SET_CLOSE',
  //----------------Config--------------------------------------
  SET_CONFIG = 'SET_CONFIG',
  //----------------Loading-------------------------------------
  SET_LOADING_REPORTS = 'SET_LOADING_REPORTS',
  SET_LOADING_REPORT_SINGLE = 'SET_LOADING_REPORT_SINGLE',
  //------------reports ------------------------------
  SET_REPORTS = 'SET_REPORTS',
  SELECT_REPORT = 'SELECT_REPORT',
  SELECT_REPORT_MARKETPLACE = 'SELECT_REPORT_MARKETPLACE',
  SET_SLICER_FILTER = 'SET_SLICER_FILTER',
}

export interface IUiReport {
  reportId: string;
  reportName: string;
  beta?: boolean;
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

interface IProperties {
  userName: string | undefined;
  emailId: string | undefined;
  reportId?: string;
  reportName?: string;
  reportLoadTime?: number;
  message?: string;
}
export interface IAppInsight {
  type?: string;
  properties: IProperties;
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

export interface IAlert {
  type: 'success' | 'info' | 'error' | 'warning';
  content: string;
}

export interface IAlertData {
  openAlert: boolean;
  type: 'success' | 'info' | 'error' | 'warning';
  content: string;
}

export interface IAppsMenu {
  appsData: IAppData[];
  defaultAppStatus: 'success' | 'error';
}

export interface IAppData {
  name: string;
  url: string;
  permission: boolean;
  appCode: string;
  defaultApp: boolean;
  markAsDefaultApp: (app: string) => void;
  loader?: boolean;
}
