import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';

export const POWERBI_FEATURE_KEY = 'powerbi';

/*
 * Update these interfaces according to your requirements.
 */
export interface PowerbiEntity {
  id: number;
}

export interface PowerbiState extends EntityState<PowerbiEntity> {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error: string;
}

export const powerbiAdapter = createEntityAdapter<PowerbiEntity>();

/**
 * Export an effect using createAsyncThunk from
 * the Redux Toolkit: https://redux-toolkit.js.org/api/createAsyncThunk
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(fetchPowerbi())
 * }, [dispatch]);
 * ```
 */
export const fetchPowerbi = createAsyncThunk(
  'powerbi/fetchStatus',
  async (_, thunkAPI) => {
    /**
     * Replace this with your custom fetch call.
     * For example, `return myApi.getPowerbis()`;
     * Right now we just return an empty array.
     */
    return Promise.resolve([]);
  }
);

export const initialPowerbiState: PowerbiState = powerbiAdapter.getInitialState(
  {
    loadingStatus: 'not loaded',
    error: "",
  }
);

export const powerbiSlice = createSlice({
  name: POWERBI_FEATURE_KEY,
  initialState: initialPowerbiState,
  reducers: {
    add: powerbiAdapter.addOne,
    remove: powerbiAdapter.removeOne,
    // ...
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPowerbi.pending, (state: PowerbiState) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        fetchPowerbi.fulfilled,
        (state: PowerbiState, action: PayloadAction<PowerbiEntity[]>) => {
          powerbiAdapter.setAll(state, action.payload);
          state.loadingStatus = 'loaded';
        }
      )
      .addCase(fetchPowerbi.rejected, (state: PowerbiState, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message?  action.error.message : "";
      });
  },
});

/*
 * Export reducer for store configuration.
 */
export const powerbiReducer = powerbiSlice.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(powerbiActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const powerbiActions = powerbiSlice.actions;

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllPowerbi);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = powerbiAdapter.getSelectors();

export const getPowerbiState = (rootState: any): PowerbiState =>
  rootState[POWERBI_FEATURE_KEY];

export const selectAllPowerbi = createSelector(getPowerbiState, selectAll);

export const selectPowerbiEntities = createSelector(
  getPowerbiState,
  selectEntities
);
