import { IUiReportList, ActionType } from '@cloudcore/common-lib';

interface AlertOpenAction {
  type: ActionType.SET_OPEN;
  payload: {
    error: string;
    status: number;
  };
}

interface AlertCloseAction {
  type: ActionType.SET_CLOSE;
}

export type AlertsActions = AlertOpenAction | AlertCloseAction;
interface loadingAction {
  type: ActionType.SET_LOADING_REPORTS | ActionType.SET_LOADING_REPORT_SINGLE;
  payload: boolean;
}

interface loadReportsAction{
  type : ActionType. SET_REPORTS;
  payload : IUiReportList[]
}
interface selectReportAction{
  type : ActionType.SELECT_REPORT;
  payload : string | null
}

interface selectFilterItemSelectedAction{
  type : ActionType.SET_SLICER_FILTER;
  payload : {
    filterItem: string[];
    operator: string;
  }
}
export type LoadReportsAction = loadReportsAction
export type SelectReportAction = selectReportAction
export type LoadingActions = loadingAction;
export type SelectFilterItemSelectedAction = selectFilterItemSelectedAction;