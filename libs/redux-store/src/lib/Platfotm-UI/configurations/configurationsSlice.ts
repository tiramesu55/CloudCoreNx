import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import axios from "axios";
import { OktaAuthOptions } from "@okta/okta-auth-js";

interface Configuration {
  baseUrl: string;
  oidcConfig: OktaAuthOptions;
  authToken?: string;
  isConfigSet: boolean;
  logoutSSO:string; 
  postLogoutRedirectUri: string;
}

const initialState: Configuration = {
  
    baseUrl: "https://apim-nexiacc-dev-eastus2-a5efee35.azure-api.net/platform-api",
    logoutSSO : "https://apim-nexiacc-dev-eastus2-a5efee35.azure-api.net/powerbi-node-dev/SSOLogout",
     oidcConfig: {
      issuer: "https://iarx-services.oktapreview.com/oauth2/default/",
      clientId: "0oa2e7f4dvYLDDdmw1d7",
      redirectUri: "https://platform8ui.dev.nexia.app/login/callback",
      postLogoutRedirectUri:"https://ssotest.walgreens.com/idp/idpLogout",
      pkce:true
    },
  authToken: "",
  isConfigSet: false,
  postLogoutRedirectUri: "",
};
//gets configuration from public
export const getConfig = createAsyncThunk(
  "configuration/getConfig",
  async () => {
    const response = await axios.get("/config.json");
    // The value we return becomes the `fulfilled` action payload
    return {
      data: response.data,
      type: "getConfig",
    };
  }
);
export const configurationSlice = createSlice({
  name: "configuration",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    },
    setLogoutSSO: (state, action: PayloadAction<string>) => {
      console.log(action)
      state.logoutSSO = action.payload;
    },
    setPostLogoutRedirectUri: (state, action: PayloadAction<string>) => {
      console.log(action)
      state.postLogoutRedirectUri = action.payload;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder.addCase(getConfig.fulfilled, (state, action) => {
      state.baseUrl = action.payload.data.baseUrl;
      state.logoutSSO = action.payload.data.logoutSSO;
      state.oidcConfig = action.payload.data.oidcConfig;
      state.isConfigSet = true;
    });
  },
});

export const selectBaseUrl = (state: RootState) => state.config.baseUrl;

export const postLogoutRedirectUri = (state: RootState) => state.config.oidcConfig.postLogoutRedirectUri;

export const logoutSSO = (state: RootState) => state.config.logoutSSO;

export const selectOidc = (state: RootState) => state.config.oidcConfig;

export const selectToken = (state: RootState) => state.config.authToken;

export const { setToken, setLogoutSSO, setPostLogoutRedirectUri } = configurationSlice.actions;

export const isConfigSet = (state: RootState) => state.config.isConfigSet;

export const configReducer = configurationSlice.reducer;
