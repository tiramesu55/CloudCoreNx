import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
    createEntityAdapter,
  } from "@reduxjs/toolkit";
  import { RootState } from "../../store-platform";
  import axios from "axios";
  
  import {
    getWorkspaceIdByDomain,
    getSuitesByDomain,
    getReports,
    deleteSuite,
    updateSuite,
    updateWorkSpaceIdByDomain,
    getAvailableReports,
  } from "./customReportsAPI";
  
  export interface Suite {
    id: string;
    discriminator: string;
    domain: string;
    name: string;
    permission: string;
    reports: Reports[];
  }
  
  interface Reports {
    reportId: string;
    reportName: string;
  }
  
  interface AvailableReport {
    ReportId : string;
    ReportName : string;
  }
  
  interface AvailableReports {
    Result : AvailableReport[]
  }
  
  interface SuiteState {
    suites: Suite[];
    workspaces: Workspace[];
    selectedPermission: string;
    availableReports : AvailableReports;
    status: "idle" | "loading" | "failed" | "error";
    suiteFormModified: boolean;
    resetForm: boolean;
  }
  
  interface SuitesGetAction {
    data: Suite[];
    type: string;
  }
  
  interface SuiteAction {
    data: Suite;
    type: string;
  }
  
  interface Workspace {
    id : string;
    workspaceId: string;
    domain: string;
  }
  
  interface WorkspaceGetAction {
    data: Workspace[];
    type: string;
  }
  
  interface DeleteSuitAction {
    data: { ID: string };
    type: string;
  }
  
  interface UpdateWorkSpaceIdAction {
    data: Workspace;
    type: string
  }
  
  interface GetAvailableReportsAction {
    data: AvailableReports;
    type: string
  }
  
const initialState: SuiteState = {
    suites: [],
    selectedPermission: "",
    workspaces: [],
    availableReports : {Result : []},
    status: "idle",
    suiteFormModified: false,
    resetForm: false,
  };
  
  export const getSuitesAsync = createAsyncThunk<
    SuitesGetAction,
    any,
    { state: RootState }
  >("suite/getSuites", async ({ url, token, domain } : {url: string, token: string, domain: string}, { getState }) => {
    //if not authorized - no token
    if (!token) return { data: [], type: "getAll" };
    const response = await getSuitesByDomain(url, domain, token);
    // The value we return becomes the `fulfilled` action payload
    return {
      data: response.data,
      type: "getAll",
    };
  });
  
  export const getWorkspaceIDByDomainAsync = createAsyncThunk<
    WorkspaceGetAction,
    any,
    { state: RootState }
  >("workspace/getWorkspaces", async ({ url, token, domain } : {url: string, token: string, domain: string}, { getState }) => {
    //if not authorized - no token
    if (!token) return { data: [], type: "get" };
    const response = await getWorkspaceIdByDomain(url, domain, token);
    // The value we return becomes the `fulfilled` action payload
    return {
      data: response.data,
      type: "getAll",
    };
  });
  
  export const updateSuiteAsync = createAsyncThunk<
    SuiteAction,
    any,
    { state: RootState }
  >("suite/updateSuite", async ({ url, token, suite } : {url: string, token: string, suite: Suite}, { getState }) => {
    //if not authorized - no token
    if (!token) return { data: null, type: "updateOne" };
    const response = await updateSuite(url, suite, token);
    // The value we return becomes the `fulfilled` action payload
    return {
      data: response.data,
      type: "updateOne",
    };
  });
  
  export const deleteSuiteAsync = createAsyncThunk<
    DeleteSuitAction,
    any,
    { state: RootState }
  >("suite/deleteSuite", async ({ url, token, id } : {url: string, token: string, id: string}, { getState }) => {
    //if not authorized - no token
    if (!token) return { data: {}, type: "deleteSuite" };
    const response = await deleteSuite(url, id, token);
    // The value we return becomes the `fulfilled` action payload
    return {
      data: response.data,
      type: "deleteSuite",
    };
  });
  
  export const updateWorkSpaceIdByDomainAsync = createAsyncThunk<
    UpdateWorkSpaceIdAction,
    any,
    { state: RootState }
  >("workspace/updateWorkSpaceIdByDomain", async ({ url, token, data } : {url: string, token: string, data: any}, { getState }) => {
    //if not authorized - no token
    if (!token) return { data: {}, type: "updateWorkSpaceIdByDomain" };
    const response = await updateWorkSpaceIdByDomain(url, data, token);
    // The value we return becomes the `fulfilled` action payload
    return {
      data: response.data,
      type: "updateWorkSpaceIdByDomain",
    };
  })
  
  export const getAvailableReportsAsync = createAsyncThunk<
    GetAvailableReportsAction,
    any,
    { state: RootState }
  >("availableReports/getAvailableReportsByDomain", async ({ url, token } : {url: string, token: string},{ getState }) => {
  
    //if not authorized - no token
    if (!token) return { data: {}, type: "getAvailableReports" };
    const response = await getAvailableReports(url, token);
    // The value we return becomes the `fulfilled` action payload
    return {
      data: response.data,
      type: "getAvailableReports",
    };
  })
  
  export const customReportSlice = createSlice({
    name: "customReports",
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
      setSuiteFormModified: (state, action: PayloadAction<boolean>) => {
        state.suiteFormModified = action.payload;
      },
      setResetForm: (state, action: PayloadAction<boolean>) => {
        state.resetForm = action.payload;
      },
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {
      builder
        .addCase(getSuitesAsync.pending, (state) => {
          state.status = "loading";
        })
        .addCase(getSuitesAsync.fulfilled, (state, action) => {
          state.status = "idle";
          state.suites = action.payload.data;
        })
        .addCase(getSuitesAsync.rejected, (state) => {
          state.status = "failed";
        })
        .addCase(deleteSuiteAsync.pending, (state) => {
          state.status = "loading";
        })
        .addCase(deleteSuiteAsync.fulfilled, (state, action) => {
          state.status = "idle";
        })
        .addCase(deleteSuiteAsync.rejected, (state) => {
          state.status = "failed";
        })
        .addCase(getWorkspaceIDByDomainAsync.pending, (state) => {
          state.status = "loading";
        })
        .addCase(getWorkspaceIDByDomainAsync.fulfilled, (state, action) => {
          state.status = "idle";
          state.workspaces = action.payload.data;
        })
        .addCase(getWorkspaceIDByDomainAsync.rejected, (state) => {
          state.status = "failed";
        })
        .addCase(updateWorkSpaceIdByDomainAsync.pending, (state) => {
          state.status = "loading";
        })  
        .addCase(updateWorkSpaceIdByDomainAsync.fulfilled, (state, action) => {
          state.status = "idle";
          state.workspaces = state.workspaces.map((workspace) => {
            if(workspace.id === action.payload.data.id){
              return action.payload.data
            }else{
              return workspace
            }
          })
        })
        .addCase(updateWorkSpaceIdByDomainAsync.rejected, (state) => {
          state.status = "failed";
        })
        .addCase(updateSuiteAsync.pending, (state) => {
          state.status = "loading";
        })
        .addCase(updateSuiteAsync.fulfilled, (state) => {
          state.status = "idle";
        })
        .addCase(updateSuiteAsync.rejected, (state) => {
          state.status = "failed";
        })
        .addCase(getAvailableReportsAsync.pending, (state) => {
          state.status = "loading";
        })
        .addCase(getAvailableReportsAsync.fulfilled, (state, action) => {
          state.status = "idle";
          state.availableReports = action.payload.data;
        })
        .addCase(getAvailableReportsAsync.rejected, (state) => {
          state.status = "failed";
        });
    },
  });
  
  export const { setSuiteFormModified, setResetForm } = customReportSlice.actions;
  
  export const permissionsList = (state: RootState) =>
    state.customReports.suites.map(function (suite) {
      return suite["permission"];
    });
  
  export const getWorkspaceId = (state: RootState, domain: string) => {
    const workspace = state.customReports.workspaces.find((ws) => {
      return ws?.domain === domain;
    });
    return workspace?.workspaceId;
  }
  export const selectedSuite = (state: RootState, permission: string) => {
    const selectedSuite = state.customReports.suites.find((suite) => {
      return suite?.permission === permission;
    });
    return selectedSuite
  };
  
  export const getSuiteByPermission = (state: RootState, permission: string) => {
    const suite = state.customReports.suites.find((suite) => {
      return suite?.permission === permission;
    });
    return suite;
  };
  
  export const selectedReports = (state: RootState, permission: string) => {
    const selectedReports = state.customReports.suites.find((suite) => {
      return suite?.permission === permission;
    });
  
    return selectedReports?.reports;
  };
  
  export const availableReports = (state : RootState) => 
      state.customReports.availableReports.Result.filter(availRep => {
        return !state.customReports.suites.map(suite => {
          return suite.reports
        }).flat().some((assignedDash :any) => {
          return availRep.ReportId === assignedDash.reportId;
        });
      })
  
  export const getSuiteFormModified = (state: RootState) =>
    state.customReports.suiteFormModified;
  
  export const resetForm = (state: RootState) =>
    state.customReports.resetForm;
  
  export const customReportsReducer =  customReportSlice.reducer;
  