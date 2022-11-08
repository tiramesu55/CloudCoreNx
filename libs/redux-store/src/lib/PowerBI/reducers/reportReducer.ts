import { AnyAction } from "redux";
import { IUiReportList, IFilterReport, ActionType } from '@cloudcore/common-lib';

export interface IReportReducerState {
  loadingReportsAll: boolean;
  loadingSingleReport: boolean;
  selectedReportId: string;
  reports:IUiReportList[] | undefined; 
  selectedReportMarketplaceId: string;
  reportFilter: IFilterReport | undefined;
}

export const reportReducer = (
  state: IReportReducerState = {
    loadingReportsAll: false,
    loadingSingleReport: false,
    selectedReportId: "",
    selectedReportMarketplaceId: "",
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
        selectedReportId: ""
      };
     case ActionType.SELECT_REPORT:
        return {
          ...state,
          selectedReportId: action["payload"],
        };
      case ActionType.SET_SLICER_FILTER: 
        return {
          ...state,
          reportFilter: {
                filterItem: action["payload"].filterItem,
                operator: action["payload"].operator
              }
        }
    case ActionType.SELECT_REPORT_MARKETPLACE:
      return {
        ...state,
        selectedReportMarketplaceId: action['payload'],
      };
    default:
      return state;
  }
};
