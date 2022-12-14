import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store-marketplace";
//https://apim-nexiacc-dev-eastus2-a5efee35.azure-api.net/marketplace/config
import {
    getConfigApi,
    updateConfigApi
  } from "./configurationApi";

  export interface Configuration{
    borrowing?:number,
    capacity?: number,
    partnerOrders?: boolean,
   
  }

  export interface ConfigurationState {
    config: Configuration;
    status: "idle" | "loading" | "failed" | "error";
  }

  interface ConfigAction{
    data : Configuration;
    type: string;
  }
  export const getConfiguration = createAsyncThunk<ConfigAction, any >(
    "configuration/get",
    async ({ url, token } : {url: string, token: string}) => {
      if(!token)
      return {data: null, type: "get"}
      const response = await getConfigApi(url,token);
      // The value we return becomes the `fulfilled` action payload
      return {
        data: response.data,
        type: "get",
      };
    }
    );
    interface ConfigPayload {
        cnf: Configuration; 
        url: string;
        token: string;
      }
    export const updateConfiguration = createAsyncThunk<ConfigAction,any>(
        "configuration/update",
         async (configPayload:ConfigPayload  ) => {
          const { cnf, url, token } = configPayload;

          if(!token)
          return {data: null, type: "update"}
            const response = await updateConfigApi(cnf, url,token);
            // The value we return becomes the `fulfilled` action payload
            return {
              data: response.data,
              type: "update",
            };
          }
      
      );
    const initialState: ConfigurationState = { config:{ borrowing:0,capacity: 0, partnerOrders: false}, status: "idle"}

      export const configurationSlice = createSlice({name: "configuration", initialState   ,
       reducers: {
         
        },
        // The `extraReducers` field lets the slice handle actions defined elsewhere,
        // including actions generated by createAsyncThunk or in other slices.
        extraReducers: (builder) => {
          builder
            .addCase(getConfiguration.pending, (state) => {
              state.status = "loading";
            })
            .addCase(getConfiguration.fulfilled, (state, action) => {
              state.status = "idle";
              state.config = action.payload.data
      
            })
            .addCase(getConfiguration.rejected, (state) => {
              state.status = "failed";
            })
      
            .addCase(updateConfiguration.fulfilled, (state, action) => {
              state.status = "idle";
              state.config = action.payload.data;
               
            })
           
            .addCase(updateConfiguration.rejected, (state) => {
                state.status = "failed";
            })
        
      
        },
      });
      export const selectConfiguration = (state: RootState) =>   state.configuration.config;
      export const configReducer = configurationSlice.reducer;
