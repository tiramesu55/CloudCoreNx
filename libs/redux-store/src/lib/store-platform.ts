import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { userReducer } from './Platform-UI/users/userSlice';
import { applicationsReducer } from './Platform-UI/applications/applicationsSlice';
import { sitesReducer } from './Platform-UI/sites/siteSlice';
import { dashboardReduser } from './Platform-UI/dashboard/dashboardSlice';
import { organizationsReducer } from './Platform-UI/organizations/organizationsSlice';
import { suiteManagementReducer } from './Platform-UI/suiteManagement/suiteManagementSlice';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { commonReducer } from './Common/commonSlice';
import { maintenanceReducer } from "./Maintenance/maintenanceSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    applications: applicationsReducer,
    sites: sitesReducer,
    dashboard: dashboardReduser,
    organizations: organizationsReducer,
    suiteManagement: suiteManagementReducer,
    common: commonReducer,
    maintenance : maintenanceReducer,
  },
  devTools: process.env['NODE_ENV'] !== 'production',
  // Optional Redux store enhancers
  enhancers: [],
});
//type for combine state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
