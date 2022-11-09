import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { reportReducer } from "./PowerBI/reducers/reportReducer"
import {userReducer} from './Platform-UI/users/userSlice';
import {applicationsReducer} from './Platform-UI/applications/applicationsSlice';
import {sitesReducer} from './Platform-UI/sites/siteSlice';
import {dashboardReduser} from './Platform-UI/dashboard/dashboardSlice';
import { organizationsReducer } from './Platform-UI/organizations/organizationsSlice';
import { TypedUseSelectorHook,  useSelector, useDispatch } from 'react-redux';
import { customReportsReducer } from "./Platform-UI/custom-reports/customReportsSlice";
import { configReducer } from "./marketplace/configuration/configurationSlice";
import { commonReducer } from "./Common/commonSlice";

export const store = configureStore({
   reducer:{
      report: reportReducer,
      configuration: configReducer,
      user: userReducer,
      applications: applicationsReducer,
      sites: sitesReducer,
      dashboard: dashboardReduser,
      organizations: organizationsReducer,
      customReports : customReportsReducer,
      common: commonReducer
   },
   devTools: process.env['NODE_ENV'] !== 'production',
   // Optional Redux store enhancers
   enhancers: [],
})
//type for combine state
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();