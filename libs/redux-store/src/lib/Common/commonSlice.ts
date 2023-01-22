import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserConfigApi, upsertUserConfigApi } from './commonAPI';

export interface CommonState {
  openAlert: boolean;
  type: 'success' | 'info' | 'error' | 'warning';
  status: 'idle' | 'loading' | 'failed';
  content: string;
  userConfig: UserConfig;
  error: string;
}

interface ActionPayload {
  type: 'success' | 'info' | 'error' | 'warning';
  content: string;
}

interface UserConfigGetAction {
  data: UserConfig;
  type: string;
}

export interface UserConfig {
  discriminator: string;
  email: string;
  id: string;
  lastOpenedReportId: string;
  userSetDefaultApp: string;
  defaultApp: null | string;
  orgCode: string;
  inactiveDate: Date | null;
  startDate: Date | null;
  endDate: Date | null;
  createdBy: string;
  modifiedBy: string;
  createdDate: Date | null;
  modifiedDate: Date | null;
}

const initialState: CommonState = {
  openAlert: false,
  type: 'error',
  status: 'idle',
  content: '',
  error: '',
  userConfig: {
    discriminator: '',
    email: '',
    id: '',
    lastOpenedReportId: '',
    userSetDefaultApp: '',
    defaultApp: null,
    orgCode: '',
    inactiveDate: null,
    startDate: null,
    endDate: null,
    createdBy: '',
    modifiedBy: '',
    createdDate: null,
    modifiedDate: null,
  },
};

export const getUserConfig = createAsyncThunk<UserConfigGetAction, any>(
  'Users/userConfig',
  async ({ url, token }: { url: string; token: string }, { getState }) => {
    if (!token) return { data: null, type: 'updateOne' };
    const response = await getUserConfigApi(url, token);
    // The value we return becomes the `fulfilled` action payload
    return {
      data: response.data,
      type: 'updateOne',
    };
  }
);

export const upsertUserConfig = createAsyncThunk<UserConfigGetAction, any>(
  'Users/userConfig',
  async (
    { url, token, data }: { url: string; token: string; data: any },
    { getState }
  ) => {
    if (!token) return { data: null, type: 'updateOne' };
    const response = await upsertUserConfigApi(url, token, data);
    // The value we return becomes the `fulfilled` action payload
    return {
      data: response.data,
      type: 'updateOne',
    };
  }
);

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    openAlertAction: (state, action: PayloadAction<ActionPayload>) => {
      state.openAlert = true;
      //  state.applications
      state.content = action.payload.content;
      state.type = action.payload.type;
    },
    closeAlertAction: (state) => {
      state.openAlert = false;
      //  state.applications
      state.content = '';
      // state.type = 'error';
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getUserConfig.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getUserConfig.fulfilled, (state, action) => {
        state.userConfig = action.payload.data;
        state.status = 'idle';
      })
      .addCase(getUserConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
      });
  },
});
export const { openAlertAction, closeAlertAction } = commonSlice.actions;
export const commonReducer = commonSlice.reducer;
