import { AnyAction } from "redux";
import { ActionType } from "../action-types";
import { IConfig } from "../../models/config";

export interface IdleConfigReducerState {
  config: IConfig | null;
  error: {
    error: string;
    status: number;
  };
  alertState: boolean;

}

const ConfigReducer = (
  state: IdleConfigReducerState = {
    config: null,
    error: {
      error: "",
      status: 0
    },
    alertState: false,

  },
  action: AnyAction
): IdleConfigReducerState => {
  switch (action.type) {
    case ActionType.SET_CONFIG:
      return {
        ...state,
        config: action["payload"],
      };
    case ActionType.SET_OPEN:
      return {
        ...state,
        error: action["payload"],
        alertState: true,
      };
    case ActionType.SET_CLOSE:
      return {
        ...state,
        error: {
          error: "",
          status: 0
        },
        alertState: false,
      };

    default:
      return state;
  }
};

export default ConfigReducer;
