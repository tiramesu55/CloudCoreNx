import { AlertsActions, LoadingActions, LoadReportsAction, SelectReportAction, SelectFilterItemSelectedAction } from "../actions";
import { Dispatch } from "redux";
import { IUiReport,IUiReportList, ActionType } from '@cloudcore/common-lib';

export const openAlert =
  (error: string, status: number) => async (dispatch: Dispatch<AlertsActions>) => {
    dispatch({
      type: ActionType.SET_OPEN,
      payload: {
        error,
        status
      },
    });
  };

export const closeAlert = () => async (dispatch: Dispatch<AlertsActions>) => {
  dispatch({
    type: ActionType.SET_CLOSE,
  });
};


export const loadingReports =
  (loadingState: boolean) => async (dispatch: Dispatch<LoadingActions>) => {
    dispatch({
      type: ActionType.SET_LOADING_REPORTS,
      payload: loadingState,
    });
};

export const loadingReportSingle =
  (loadingState: boolean) => async (dispatch: Dispatch<LoadingActions>) => {
    dispatch({
      type: ActionType.SET_LOADING_REPORT_SINGLE,
      payload: loadingState,
    });
};

export const loadReports =
  (reportsState: IUiReportList[]) => async (dispatch: Dispatch<LoadReportsAction>) => {
    dispatch({
      type: ActionType.SET_REPORTS,
      payload: reportsState,
    });
};

export const selectReport =
  (reportState: IUiReport) => async (dispatch: Dispatch<SelectReportAction>) => {
    dispatch({
      type: ActionType.SELECT_REPORT,
      payload: reportState,
    });
};

export const selectReportMarketplace =
  (reportState: string | null) => async (dispatch: Dispatch<SelectReportAction>) => {
    dispatch({
      type: ActionType.SELECT_REPORT_MARKETPLACE,
      payload: reportState,
    });
};

export const selectFilterItemSelected =
  (filterItem: string[], operator: string) => async (dispatch: Dispatch<SelectFilterItemSelectedAction>) => {
    dispatch({
      type: ActionType.SET_SLICER_FILTER,
      payload: {
        filterItem,
        operator
      }
    });
};

