/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createEntityAdapter,
  isPending,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";
import { RootState } from "../../store-platform";
import {
  getSitesByOrganizationApi,
  updateSiteApi,
  addSiteApi,
  deleteSiteApi,
} from "./sitesAPI";

interface SitesGetAction {
  data: Site[];
  type: string;
}

interface SiteAction {
  data: Site;
  type: string;
}

interface SiteDeleteAction {
  data: { id: string };
  type: string;
}

export interface Address {
  street: string;
  city: string;
  zip: string;
  state: string;
}

interface IActionUpdateField {
  id: number | string;
  key: string;
  value: string | object | [];
}

export interface Site {
  id: string;
  siteCode: string;
  siteName: string;
  address: Address;
  siteIdentifier: string;
  description: string;
  orgCode: string;
  serviceEmail: string;
  configPath: string;
  siteManagers: string[];
  inactiveDate: Date | null;
  startDate?: Date | null;
  endDate?: Date | null;
  phone: string;
  applications: ApplicationSite[];
  createdBy: string | null;
  modifiedBy: string | null;
  createdDate: Date | null;
  modifiedDate: Date | null;
}

export interface ApplicationSite {
  appCode: string;
  subscriptionStart: Date | null;
  subscriptionEnd: Date | null;
}

export interface SiteState {
  sites: Site[];
  site: Site;
  selectedId: string;
  status: "idle" | "loading" | "failed";
  siteFormModified : boolean;
}

const siteAdapter = createEntityAdapter<Site>({
  sortComparer: (a, b) => a.id.localeCompare(b.id),
});

const initialState = siteAdapter.getInitialState<SiteState>({
  sites: [],
  site: {
    id: "",
    siteCode: "",
    siteName: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    siteIdentifier: "",
    description: "",
    orgCode: "",
    serviceEmail: "",
    configPath: "",
    siteManagers: [],
    inactiveDate: null,
    startDate: null,
    endDate: null,
    phone: "",
    applications: [],
    createdBy: null,
    modifiedBy: null,
    createdDate: null,
    modifiedDate: null,
  },
  selectedId: "",
  status: "idle",
  siteFormModified : false,
});

export const getSites = createAsyncThunk<
  SitesGetAction,
  any,
  { state: RootState }
>("sites/getSites", async ({ orgCode, url, token }: { orgCode: string, url: string, token: string }, { getState }) => {
  if (!token) return { data: [], type: "getAll" };
  const response = await getSitesByOrganizationApi(url, token, orgCode);
  // The value we return becomes the `fulfilled` action payload
  return {
    data: response.data,
    type: "getAll",
  };
});

export const updateSite = createAsyncThunk<
  SiteAction,
  any,
  { state: RootState }
>("sites/updateSite", async ({site, url, token} : {site: Site, url: string, token: string}, { getState }) => {
  if (!token) return { data: null, type: "updateOne" };
  const response = await updateSiteApi(url, token, site);
  // The value we return becomes the `fulfilled` action payload
  return {
    data: response.data,
    type: "updateOne",
  };
});

export const createSite = createAsyncThunk<
  SiteAction,
  any,
  { state: RootState }
>("sites/createSite", async ({site, url, token} : {site: Site, url: string, token: string}, { getState }) => {
  if (!token) return { data: null, type: "addOne" };
  const response = await addSiteApi(url, token, site);
  // The value we return becomes the `fulfilled` action payload
  return {
    data: response.data,
    type: "addOne",
  };
});

export const deleteSite = createAsyncThunk<
  SiteDeleteAction,
  any,
  { state: RootState }
>("sites/deleteSite", async ({id, url, token} : {id: string, url: string, token: string}, { getState }) => {
  if (!token) return { data: null, type: "deleteOne" };

  const response = await deleteSiteApi(url, token, id);
  // The value we return becomes the `fulfilled` action payload
  return {
    data: response.data,
    type: "deleteOne",
  };
});

export const siteSelector = siteAdapter.getSelectors(
  (state: RootState) => state.sites
);

export const siteSlice = createSlice({
  name: "sites",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateSiteField: (state, action: PayloadAction<IActionUpdateField>) => {
      state.site = {
        ...state.site,
        [action.payload.key]: action.payload.value,
      };
    },
    updateSiteAdress: (state, action: PayloadAction<any>) => {
      state.site = {
        ...state.site,
        address: {
          ...state.site.address,
          [action.payload.key]: action.payload.value,
        },
      };
    },
    selectedIdSite: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
    setSite: (state, action: PayloadAction<Site>) => {
      state.site = action.payload;
    },
    resetSite: (state) => {
      state.site = initialState.site;
    },
    setSiteFormModified : (state, action : PayloadAction<boolean>) => {
      state.siteFormModified = action.payload;
    }
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
    .addCase(getSites.pending, (state) => {
      state.status = "loading";
    })
      .addCase(getSites.fulfilled, (state, action) => {

        state.sites = action.payload.data;
        state.selectedId = action.payload.data[0]?.id
        siteAdapter.upsertMany(state, action?.payload?.data!);
        state.status = "idle";
      })
      .addCase(getSites.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(updateSite.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSite.fulfilled, (state, action) => {
        state.status = "idle";
        state.sites = state.sites.map((st) => {
          if (st.id === action.payload.data.id) {
            return {
              ...action.payload.data,
            };
          } else {
            return st;
          }
        });
      })
      .addCase(updateSite.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(createSite.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createSite.fulfilled, (state, action) => {
        state.status = "idle";
        state.sites = [...state.sites, action.payload.data].filter(
          (item) => item.id
        );
      })
      .addCase(createSite.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(deleteSite.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteSite.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(deleteSite.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export const {
  updateSiteField,
  updateSiteAdress,
  selectedIdSite,
  setSite,
  resetSite,
  setSiteFormModified,
} = siteSlice.actions;

export const selectAllSites = (state: RootState) => state.sites.sites;
export const selectedSite = (state: RootState) => state.sites.site;
export const getSiteFormModified = (state : RootState) => state.sites.siteFormModified;

export const selectOpenSites = (state: RootState, app: string) => {
  const predicate = (item: ApplicationSite) =>
    item.appCode === app &&
    ((item.subscriptionEnd && item.subscriptionEnd.getTime() > Date.now()) ||
      !item.subscriptionEnd);
  //get all sites associated with app
  const appSites = state.sites.sites.filter((p) =>
    p.applications.find((a) => predicate(a))
  );
  //reshape sites
  const shapedSites = appSites.map((p) => ({
    appCode: app,
    sites: [{ id: p.id, code: p.siteCode }],
  }));
  return shapedSites;
};
export const sitesReducer = siteSlice.reducer;
