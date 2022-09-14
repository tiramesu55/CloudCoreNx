import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import organizationsReducer from "../features/organizations/organizationsSlice";
import siteReducer from "../features/sites/siteSlice";
import applicationReducer from "../features/applications/applicationsSlice";
import userReducer from "../features/users/userSlice";
import configReducer from "../features/configurations/configurationsSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";

export const store = configureStore({
  reducer: {
    organizations: organizationsReducer,
    user: userReducer,
    applications: applicationReducer,
    sites: siteReducer,
    config: configReducer,
    dashboard: dashboardReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
