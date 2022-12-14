/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { RootState } from '../../store-platform';
import axios from "axios";

export interface Organization {
  name: string;
  description?: string;
  id: string;
  orgCode: string;
  orgDomains: string[];
  root: boolean | null;
  address: Address;
  contactName?: string;
  contactInfo?: string;
  orgAdmins: string[];
  inactiveDate?: Date | null;
  startDate?: Date | null;
  endDate?: Date | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  createdDate: Date | null;
  modifiedDate: Date | null;
  officePhone: string;
  officeEmail: string;
  childOrgs: [];
}

interface OrganizationStats {
  users: number;
  sites: number;
  orgAdmins: number;
}

interface OrganizationDomain {
  domainName: string;
  users: number;
}

interface Address {
  street: string;
  city: string;
  zip: string;
  state: string;
}

interface OrgsGetAction {
  data: Organization[];
  type: string;
}

interface OrgAction {
  data: Organization;
  type: string;
}

interface OrgStatsAction {
  data: OrganizationStats;
  type: string;
}

interface AllOrgDomainsAction {
  data: OrganizationDomain[];
  type: string;
}

export interface OrganizationsState {
  organizations: Organization[];
  organization: Organization;
  organizationStats: OrganizationStats;
  allOrgDomains: OrganizationDomain[];
  selectedId: string;
  status: "idle" | "loading" | "failed";
  orgFormModified : boolean;
}

interface IActionUpdateField {
  id: number | string;
  key: string;
  value: string | object | [];
}

export const getOrganizationsAsync = createAsyncThunk<
  OrgsGetAction,
  any,
  { state: RootState }
>("organizations/getOrganizations", async ({ url, token } : {url: string, token: string}, { getState }) => {
  if (!token) return { data: [], type: "getAll" };
  const response = await axios.get<any>(
    `${url}/Platform/PlatformOrganization`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  // The value we return becomes the `fulfilled` action payload
  return {
    data: response.data,
    type: "getAll",
  };
});
 
interface IOrgCall {
  organization: Organization;
  url: string;
  token: string;
}
export const updateOrganizationAsync = createAsyncThunk<
  OrgAction,
  any,
  { state: RootState }
>(
  "organizations/updateOrganization",
  async ( orgData: IOrgCall , { getState }) => {
    const { url, organization, token } = orgData;
    if (!token) return { data: null, type: "updateOne" };
    const response = await axios.put(
      `${url}/UpdateOrganization`,
      organization,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // The value we return becomes the `fulfilled` action payload
    return {
      data: response.data,
      type: "updateOne",
    };
  }
);

export const createOrganizationAsync = createAsyncThunk<
  OrgAction,
  any,
  { state: RootState }
>(
  "organizations/createOrganization",
  async ( orgData: IOrgCall, { getState }) => {
    const { url, organization, token } = orgData;
    if (!token) return { data: null, type: "addOne" };
    const response = await axios.post(
      `${url}/Platform/Add/PlatformOrganization`,
      organization,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // The value we return becomes the `fulfilled` action payload
    return {
      data: response.data,
      type: "addOne",
    };
  }
);
interface IOrgCode {
  url: string;
  orgCode: string;
  token: string;
}
export const deleteOrganizationAsync = createAsyncThunk<
  OrgAction,
  any,
  { state: RootState }
>("organizations/deleteOrganization", async (orgData: IOrgCode, { getState }) => {
  const { url, orgCode, token } = orgData;
  if (!token) return { data: null, type: "deleteOne" };
  const response = await axios.delete(
    `${url}/Platform/PlatformOrganization/${orgCode}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  // The value we return becomes the `fulfilled` action payload
  return {
    data: response.data,
    type: "deleteOne",
  };
});

export const getOrganizationStatsAsync = createAsyncThunk<
  OrgStatsAction,
  any,
  { state: RootState }
>("organizations/organizationStats", async (orgData: IOrgCode, { getState }) => {
  const { url, orgCode, token } = orgData;
  if (!token) return { data: null, type: "getStats" };
  const response = await axios.get(
    `${url}/Statistics/Organization/${orgCode}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  // The value we return becomes the `fulfilled` action payload
  return {
    data: response.data,
    type: "getStats",
  };
});

export const getAllOrganizationsDomains = createAsyncThunk<
  AllOrgDomainsAction,
  any,
  { state: RootState }
>("organizations/organizationDomains", async ({ url, token } : { url: string, token: string }, { getState }) => {
  if (!token) return { data: null, type: "getAllDomains" };
  const response = await axios.get(`${url}/Platform/Domain/All`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // The value we return becomes the `fulfilled` action payload
  return {
    data: response.data,
    type: "getAllDomains",
  };
});

const organizationAdapter = createEntityAdapter<Organization>({
  sortComparer: (a, b) => a.id.localeCompare(b.id),
});

const initialState = organizationAdapter.getInitialState<OrganizationsState>({
  organizations: [],
  organization: {
    name: "",
    description: "",
    id: "",
    orgCode: "",
    orgDomains: [],
    root: null,
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    orgAdmins: [],
    inactiveDate: null,
    startDate: null,
    endDate: null,
    createdBy: "",
    modifiedBy: "",
    createdDate: null,
    modifiedDate: null,
    officePhone: "",
    officeEmail: "",
    childOrgs: [],
  },
  organizationStats: {
    users: 0,
    sites: 0,
    orgAdmins: 0,
  },
  selectedId: "",
  status: "idle",
  allOrgDomains: [],
  orgFormModified : false,
});

export const organizationSelector = organizationAdapter.getSelectors(
  (state: RootState) => state.organizations
);

export const organizationsSlice = createSlice({
  name: "organizations",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateField: (state, action: PayloadAction<IActionUpdateField>) => {
      state.organization = {
        ...state.organization,
        [action.payload.key]:
          action.payload.key === "orgDomains"
            ? [action.payload.value]
            : action.payload.value,
      };
    },
    updateAdress: (state, action: PayloadAction<any>) => {
      state.organization = {
        ...state.organization,
        address: {
          ...state.organization.address,
          [action.payload.key]: action.payload.value,
        },
      };
    },
    selectedIdOrganization: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
    setOrganization: (state, action: PayloadAction<Organization>) => {
      state.organization = action.payload;
    },
    resetOrganization: (state) => {
      state.organization = initialState.organization;
    },
    setOrgFormModified : (state, action: PayloadAction<boolean>) => {
      state.orgFormModified = action.payload
    }
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(getOrganizationsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getOrganizationsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.organizations = action?.payload?.data;
        state.selectedId = action?.payload?.data[0]?.id;
        organizationAdapter.upsertMany(state, action?.payload?.data!);
      })
      .addCase(getOrganizationsAsync.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(updateOrganizationAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOrganizationAsync.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(updateOrganizationAsync.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(createOrganizationAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrganizationAsync.fulfilled, (state, action) => {
        state.status = "idle";
        // state.organizations = [...state.organizations, action.payload].filter(
        //   (item) => item?.id
        // );
      })
      .addCase(createOrganizationAsync.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(deleteOrganizationAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteOrganizationAsync.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(deleteOrganizationAsync.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getOrganizationStatsAsync.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getOrganizationStatsAsync.fulfilled, (state, action) => {
        state.organizationStats = action.payload.data;
        state.status = "idle";
      })
      .addCase(getOrganizationStatsAsync.rejected, (state, action) => {
        state.organizationStats = {
          users: 0,
          sites: 0,
          orgAdmins: 0,
        };
        state.status = "failed";
      })
      .addCase(getAllOrganizationsDomains.fulfilled, (state, action) => {
        state.allOrgDomains = action?.payload?.data;
      });
  },
});

export const {
  selectedIdOrganization,
  setOrganization,
  updateField,
  updateAdress,
  resetOrganization,
  setOrgFormModified
} = organizationsSlice.actions;

export const selectOrganizations = (state: RootState) =>
  state.organizations.organizations;
export const selectedId = (state: RootState) => state.organizations.selectedId;
//exporting organization
export const selectedOrganization = (state: RootState) =>
  state.organizations.organization;

export const getOrgFormModified = (state : RootState) => {
  return state.organizations.orgFormModified;
}
  

export const organizationStats = (state: RootState) =>
  state.organizations.organizationStats;

export const allOrgDomains = (state: RootState) =>
  state.organizations.allOrgDomains.map((org) => org.domainName);

export const selectOrganizationByDomain = (state: RootState, email: string) => {
  //strip email part and do domain
  const domain = email.split("@")[1];
  const org = state.organizations.organizations.find((p) =>
    p.orgDomains?.includes(domain)
  );
  return org?.id;
};

export const selectOrgByOrgCode = (state: RootState, orgCode: string) => {
  const selectedOrgByOrgCOde = state.organizations.organizations.filter(
    (org) => {
      return org?.orgCode === orgCode;
    }
  );
  return selectedOrgByOrgCOde[0];
};

export const checkIfRootOrganization = (state: RootState, orgCode: string) => {

  const org = state.organizations.organizations.find(p => p.orgCode?.includes(orgCode))
  const root = org?.root;
  return root;
}

export const organizationList = (state: RootState) =>
state.organizations.organizations.map( function(organization) {
  return organization['name'];
})

export const getOrgCodeFromName = (state: RootState) => {
  const org = state.organizations.organizations;
  return org;
}

export const organizationsReducer = organizationsSlice.reducer;
