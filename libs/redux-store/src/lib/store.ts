import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import {userReducer} from './Platfotm-UI/users/userSlice'
import {configReducer} from './Platfotm-UI/configurations/configurationsSlice';
import {applicationsReducer} from './Platfotm-UI/applications/applicationsSlice';
import {sitesReducer} from './Platfotm-UI/sites/siteSlice';
import {dashboardReduser} from './Platfotm-UI/dashboard/dashboardSlice';
import { reportReducer } from "./PowerBI/state-management/reducers/reportReducer";

console.log("reportReducer", reportReducer)

export const store = configureStore({
   reducer:{
      user: userReducer,
      config: configReducer,
      applications: applicationsReducer,
      sites: sitesReducer,
      dashboard: dashboardReduser,
      report: reportReducer
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
//export default store