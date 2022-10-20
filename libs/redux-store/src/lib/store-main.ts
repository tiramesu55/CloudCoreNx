import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { reportReducer } from "./PowerBI/reducers/reportReducer"
import {userReducer} from './Platfotm-UI/users/userSlice';
import {applicationsReducer} from './Platfotm-UI/applications/applicationsSlice';
import {sitesReducer} from './Platfotm-UI/sites/siteSlice';
import {dashboardReduser} from './Platfotm-UI/dashboard/dashboardSlice';
import { organizationsReducer } from './Platfotm-UI/organizations/organizationsSlice';
import { TypedUseSelectorHook,  useSelector, useDispatch } from 'react-redux';
export const store = configureStore({
   reducer:{
      report: reportReducer,
      user: userReducer,
      applications: applicationsReducer,
      sites: sitesReducer,
      dashboard: dashboardReduser,
      organizations: organizationsReducer
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