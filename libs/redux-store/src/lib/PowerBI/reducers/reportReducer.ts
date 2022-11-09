import { AnyAction } from "redux";
import { IUiReportList, IFilterReport, ActionType } from '@cloudcore/common-lib';

export interface IReportReducerState {
  loadingReportsAll: boolean;
  loadingSingleReport: boolean;
  selectedReports: {
    [key: string]: string
  };
  reports:IUiReportList[] | undefined; 
  reportFilter: IFilterReport | undefined;
}

export const reportReducer = (
  state: IReportReducerState = {
    loadingReportsAll: false,
    loadingSingleReport: false,
    selectedReports: {
      selectedReportId: "",
      selectedReportMarketplaceId: "",
    },
    reports: undefined,
    reportFilter: undefined,
  },
  action: AnyAction
): IReportReducerState => {
  switch (action.type) {
    case ActionType.SET_LOADING_REPORTS:
      return {
        ...state,
        loadingReportsAll: action['payload'],
      };
    case ActionType.SET_LOADING_REPORT_SINGLE:
      return {
        ...state,
        loadingSingleReport: action['payload'],
      };
    case ActionType.SET_REPORTS:
      return {
        ...state,
        reports: action['payload'],
        loadingReportsAll: false,
        selectedReports: {
          ...state.selectedReports,
          selectedReportId: ""
        }
      };
     case ActionType.SELECT_REPORT:
        return {
          ...state,
          selectedReports: {
            ...state.selectedReports,
            [action["payload"]["key"]]: action["payload"]["value"]
          }
        };
      case ActionType.SET_SLICER_FILTER: 
        return {
          ...state,
          reportFilter: {
                filterItem: action["payload"].filterItem,
                operator: action["payload"].operator
              }
        }
    default:
      return state;
  }
};
