import { AnyAction } from "redux";
import { IUiReport, IFilterReport, ActionType } from '../interfaces/interfaces';

export interface IReportReducerState {
  loadingReportsAll: boolean;
  loadingSingleReport: boolean;
  selectedReportId: string | null;
  reports:IUiReport[] | undefined; 
  reportFilter: IFilterReport | undefined;
}

export const reportReducer = (
  state: IReportReducerState = {
    loadingReportsAll: false,
    loadingSingleReport: false,
    selectedReportId: null,
    reports: undefined,
    reportFilter: undefined
  },
  action: AnyAction
): IReportReducerState => {
  switch (action.type) {

    case ActionType.SET_LOADING_REPORTS:
      return {
        ...state,
        loadingReportsAll: action["payload"],
      };
    case ActionType.SET_LOADING_REPORT_SINGLE:
      return {
        ...state,
        loadingSingleReport: action["payload"],
      };
   case ActionType.SET_REPORTS:
      return {
        ...state,
        reports: action["payload"],
        loadingReportsAll: false,
        selectedReportId: null
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
    default:
      return state;
  }
};

