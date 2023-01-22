import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { reportReducer } from './PowerBI/reducers/reportReducer';
import { configReducer } from './marketplace/configuration/configurationSlice';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { commonReducer } from './Common/commonSlice';
import { maintenanceReducer } from './Maintenance/maintenanceSlice';
import { labelaryReduce } from './marketplace/labelry/labelrySlice';
export const store = configureStore({
  reducer: {
    report: reportReducer,
    configuration: configReducer,
    common: commonReducer,
    maintenance: maintenanceReducer,
    labelary: labelaryReduce,
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
