import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import { getFormularyListApi } from './FormularyApi';

export interface IFormularyDetails {
  id: number;
  dosageForm: string;
  name: string;
  ndc: string;
  qtyPerPkg: number;
  strength: string;
  vendor: string;
}

export interface FormularyState {
  data: IFormularyDetails[];
  status: 'idle' | 'loading' | 'failed' | 'error';
}

export const getFormularyList = createAsyncThunk<any, any>(
  'formulary/get',
  async ({
    url,
    params,
    token,
  }: {
    url: string;
    params: string;
    token: string;
  }) => {
    if (!token) return { data: null, type: 'get' };
    const response = await getFormularyListApi(url, params, token);
    return {
      data: response.data,
      type: 'get',
    };
  }
);

const formularyAdapter = createEntityAdapter<IFormularyDetails>({
  sortComparer: (a, b) =>
    a.vendor.toString().localeCompare(b.vendor.toString()),
});

const initialState = formularyAdapter.getInitialState<FormularyState>({
  data: [],
  status: 'idle',
});

export const FormularySlice = createSlice({
  name: 'formulary',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getFormularyList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getFormularyList.fulfilled, (state, action) => {
        state.status = 'idle';
        state.data = action.payload.data;
      })
      .addCase(getFormularyList.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const FormularyReducer = FormularySlice.reducer;
