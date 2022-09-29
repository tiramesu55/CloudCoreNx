import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { reportReducer } from "./PowerBI/state-management/reducers/reportReducer"
import { TypedUseSelectorHook,  useSelector, useDispatch } from 'react-redux';
export const store = configureStore({
   reducer:{
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
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();