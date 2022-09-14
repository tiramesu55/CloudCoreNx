import {
  createAsyncThunk,
  createSlice,
  isPending,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";

interface DashboardStats {
  users: number;
  sites: number;
  organizations: number;
  apps: number;
  status: "idle" | "loading" | "failed";
}

interface DashboardStatsAction {
  data: {
    users: number;
    sites: number;
    apps: number;
    org: number;
  };
  type: string;
}

const initialState: DashboardStats = {
  users: 0,
  sites: 0,
  organizations: 0,
  apps: 0,
  status: "idle",
};

export const getDashboardStats = createAsyncThunk<
  DashboardStatsAction,
  any,
  { state: RootState }
>("dashboard/getStats", async (baseUrl: string, { getState }) => {
  const state = getState();
  const token = state.config.authToken;
  const url = state.config.baseUrl;
  if (!token) return { data: {}, type: "getAllStats" };
  const response = await axios.get(`${url}/Statistics/Platform/All`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return {
    data: response.data,
    type: "getAllStats",
  };
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.status = "idle";
        state.organizations = action.payload?.data?.org;
        state.users = action.payload?.data?.users;
        state.sites = action.payload?.data?.sites;
        state.apps = action.payload?.data?.apps;
      })
      .addCase(getDashboardStats.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const getAllOrgCount = (state: RootState) =>
  state.dashboard.organizations;

export const getAllUsersCount = (state: RootState) => state.dashboard.users;

export const getAllSitesCount = (state: RootState) => state.dashboard.sites;

export default dashboardSlice.reducer;
