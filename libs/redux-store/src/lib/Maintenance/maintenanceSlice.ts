import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { UserAction } from '../Platform-UI/users/userSlice';

interface MaintenanceState {
  appsMaintenance: ApplicationMaintenance[];
  bypassUser?: boolean;
  loadAnalyticsData: boolean;
  loadPlatformData: boolean;
  loadMarketplaceData: boolean;
  status: 'idle' | 'loading' | 'failed' | 'error';
  orgCode: string;
}

const initialState: MaintenanceState = {
  appsMaintenance: [],
  bypassUser: false,
  loadAnalyticsData: false,
  loadPlatformData: false,
  loadMarketplaceData: false,
  status: 'idle',
  orgCode: '',
};

interface Role {
  role: string;
  permissions: string[];
}

interface ApplicationMaintenance {
  id: string;
  name: string;
  appCode: string;
  roles: Role[];
  maintenanceStartDate: string;
  maintenanceEndDate: string;
  maintenanceReason: string;
  maintenanceDisplayStartDate: string;
  maintenanceDisplayEndDate: string;
  fullLockout: boolean;
}

interface AppsMaintenanceGetAction {
  data: ApplicationMaintenance[];
  type: string;
}

export const getMaintenanceAsync = createAsyncThunk<
  AppsMaintenanceGetAction,
  any,
  { state: any }
>(
  'maintenance/getMaintenance',
  async ({ url, token }: { url: string; token: string }) => {
    if (!token) return { data: null, type: 'getAll' };
    const response = await axios.get(`${url}/Maintenance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // The value we return becomes the `fulfilled` action payload
    return {
      data: response.data,
      type: 'getAll',
    };
  }
);

export const bypassUserAsync = createAsyncThunk<
  UserAction,
  any,
  { state: any }
>(
  'maintenance/bypassUser',
  async (
    { email, url, token }: { email: string; url: string; token: string },
    { getState }
  ) => {
    if (!token) return { data: null, type: 'bypassUser' };

    const response = await axios.get(`${url}/Platform/PlatformUser/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // The value we return becomes the `fulfilled` action payload
    return {
      data: response.data,
      type: 'getUser',
    };
  }
);

export const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMaintenanceAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getMaintenanceAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.appsMaintenance = action.payload.data;
      })
      .addCase(getMaintenanceAsync.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(bypassUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(bypassUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.bypassUser = action.payload.data.bypassUser;
        state.orgCode = action.payload.data.orgCode;
      })
      .addCase(bypassUserAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const maintenanceReducer = maintenanceSlice.reducer;
