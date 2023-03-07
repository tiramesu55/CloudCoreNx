import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '../../store-marketplace';

import { getLabelSettingsApi } from './LabelSettingsApi';

export interface ILabelSettingsDetails {
  id: number;
  associationName: string;
  labelType: string;
  fileStream: string;
  mimType: number;
  fileName: string;
}

export interface LabelSettingsState {
  data: ILabelSettingsDetails[];
  status: 'idle' | 'loading' | 'failed' | 'error';
  activeIndex: number;
}

export const getLabelSettings = createAsyncThunk<any, any>(
  'labelSettings/get',
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
    const response = await getLabelSettingsApi(url, params, token);
    return {
      data: response.data,
      type: 'get',
    };
  }
);

const labelSettingsAdapter = createEntityAdapter<ILabelSettingsDetails>({
  sortComparer: (a, b) =>
    a.associationName.toString().localeCompare(b.associationName.toString()),
});

const initialState = labelSettingsAdapter.getInitialState<LabelSettingsState>({
  data: [],
  status: 'idle',
  activeIndex: 0,
});

export const LabelSettingsSlice = createSlice({
  name: 'labelSettings',
  initialState,
  reducers: {
    changeIndex: (state, action: PayloadAction<number>) => {
      console.log(action.payload);
      state.activeIndex = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getLabelSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getLabelSettings.fulfilled, (state, action) => {
        state.status = 'idle';
        state.data = action.payload.data;
      })
      .addCase(getLabelSettings.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { changeIndex } = LabelSettingsSlice.actions;
export const selectIndex = (state: RootState) => state.label.activeIndex;

export const LabelSettingsReducer = LabelSettingsSlice.reducer;
