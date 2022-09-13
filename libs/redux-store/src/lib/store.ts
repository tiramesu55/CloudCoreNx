import { configureStore } from '@reduxjs/toolkit'
import reportReducer from './Analytics/analyticsSlice'

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

//export default store