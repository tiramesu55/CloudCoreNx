import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store-platform';
import { getLabelImage, labelData } from './labelryApi';

interface LabelaryGetAction {
  data: string;
}

interface ILabelaryActionPayload {
  data: labelData;
}

export const initialState = {};

export const getLabelaryImage = createAsyncThunk<
  LabelaryGetAction,
  any,
  { state: RootState }
>('', async (appPayload: ILabelaryActionPayload, { getState }) => {
  const { data } = appPayload;
  const response = await getLabelImage(data);
  return {
    data: response.data,
  };
});

export const labelarySlice = createSlice({
  name: 'labelary',
  initialState,
  reducers: {},
});

export const labelaryReduce = labelarySlice.reducer;
