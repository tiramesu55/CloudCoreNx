/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { RootState } from '../../store-platform';
import {
  getOrganizationsAPI,
  updateOrganizationAPI,
  addOrganizationAPI,
  deleteOrganizationAPI,
  getOrganizationStatsAPI,
  getAllOrganizationDomainsAPI,
  getOrganizationAPI,
} from './organizationsAPI';

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
  postLogoutRedirectUrl: string;
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
  status: 'idle' | 'loading' | 'failed';
  orgFormModified: boolean;
  postLogoutRedirectUrl: string;
}

interface IActionUpdateField {
  id: number | string;
  key: string;
  value: string | object | [];
}

interface IOrgCall {
  organization: Organization;
  url: string;
  token: string;
}

interface IOrgCode {
  url: string;
  orgCode: string;
  token: string;
}

export const getOrganizationsAsync = createAsyncThunk<
  OrgsGetAction,
  any,
  { state: RootState }
>(
  'organizations/getOrganizations',
  async ({ url, token }: { url: string; token: string }, { getState }) => {
    if (!token) return { data: [], type: 'getAll' };
    const response = await getOrganizationsAPI(url, token);
    // The value we return becomes the `fulfilled` action payload
    return {
      data: response.data,
      type: 'getAll',
    };
  }
);

export const updateOrganizationAsync = createAsyncThunk<
  OrgAction,
  any,
  { state: RootState }
>(
  'organizations/updateOrganization',
  async (orgData: IOrgCall, { getState }) => {
    const { url, organization, token } = orgData;
    if (!token) return { data: null, type: 'updateOne' };
    const response = await updateOrganizationAPI(url, token, organization);

    // The value we return becomes the `fulfilled` action payload
    return {
      data: response.data,
      type: 'updateOne',
    };
  }
);

export const createOrganizationAsync = createAsyncThunk<
  OrgAction,
  any,
  { state: RootState }
>(
  'organizations/createOrganization',
  async (orgData: IOrgCall, { getState }) => {
    const { url, organization, token } = orgData;
    if (!token) return { data: null, type: 'addOne' };
    const response = await addOrganizationAPI(url, token, organization);
    // The value we return becomes the `fulfilled` action payload
    return {
      data: response.data,
      type: 'addOne',
    };
  }
);

export const deleteOrganizationAsync = createAsyncThunk<
  OrgAction,
  any,
  { state: RootState }
>(
  'organizations/deleteOrganization',
  async (orgData: IOrgCode, { getState }) => {
    const { url, orgCode, token } = orgData;
    if (!token) return { data: null, type: 'updateOne' };
    const response = await deleteOrganizationAPI(url, token, orgCode);
    // The value we return becomes the `fulfilled` action payload
    return {
      data: response.data,
      type: 'updateOne',
    };
  }
);

export const getOrganizationStatsAsync = createAsyncThunk<
  OrgStatsAction,
  any,
  { state: RootState }
>(
  'organizations/organizationStats',
  async (orgData: IOrgCode, { getState }) => {
    const { url, orgCode, token } = orgData;
    if (!token) return { data: null, type: 'getStats' };
    const response = await getOrganizationStatsAPI(url, token, orgCode);
    // The value we return becomes the `fulfilled` action payload
    // eslint-disable-next-line no-debugger
    return {
      data: response.data,
      type: 'getStats',
    };
  }
);

export const getPostLogoutRedirectUrl = createAsyncThunk<
  OrgAction,
  any,
  { state: RootState }
>('organization/getOrganization', async (orgData: IOrgCode, { getState }) => {
  const { url, orgCode, token } = orgData;
  if (!token) return { data: null, type: 'getStats' };
  const response = await getOrganizationAPI(url, token, orgCode);
  // The value we return becomes the `fulfilled` action payload
  return {
    data: response.data,
    type: 'getOne',
  };
});

export const getAllOrganizationsDomains = createAsyncThunk<
  AllOrgDomainsAction,
  any,
  { state: RootState }
>(
  'organizations/organizationDomains',
  async ({ url, token }: { url: string; token: string }, { getState }) => {
    if (!token) return { data: null, type: 'getAllDomains' };
    const response = await getAllOrganizationDomainsAPI(url, token);

    // The value we return becomes the `fulfilled` action payload
    return {
      data: response.data,
      type: 'getAllDomains',
    };
  }
);

const organizationAdapter = createEntityAdapter<Organization>({
  sortComparer: (a, b) => a.id.localeCompare(b.id),
});

const initialState = organizationAdapter.getInitialState<OrganizationsState>({
  organizations: [],
  organization: {
    name: '',
    description: '',
    id: '',
    orgCode: '',
    orgDomains: [],
    root: null,
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
    },
    orgAdmins: [],
    inactiveDate: null,
    startDate: null,
    endDate: null,
    createdBy: '',
    modifiedBy: '',
    createdDate: null,
    modifiedDate: null,
    officePhone: '',
    officeEmail: '',
    postLogoutRedirectUrl: '',
    childOrgs: [],
  },
  organizationStats: {
    users: 0,
    sites: 0,
    orgAdmins: 0,
  },
  selectedId: '',
  status: 'idle',
  allOrgDomains: [],
  orgFormModified: false,
  postLogoutRedirectUrl: '',
});

export const organizationSelector = organizationAdapter.getSelectors(
  (state: RootState) => state.organizations
);

export const organizationsSlice = createSlice({
  name: 'organizations',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateField: (state, action: PayloadAction<IActionUpdateField>) => {
      state.organization = {
        ...state.organization,
        [action.payload.key]:
          action.payload.key === 'orgDomains'
            ? [action.payload.value]
            : action.payload.value,
      };
    },
    updateAddress: (state, action: PayloadAction<any>) => {
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
    setOrgFormModified: (state, action: PayloadAction<boolean>) => {
      state.orgFormModified = action.payload;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(getOrganizationsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getOrganizationsAsync.fulfilled, (state, action) => {
        state.organizations = action.payload.data;
        state.selectedId = action.payload.data[0].id;
        organizationAdapter.upsertMany(
          state,
          action.payload.data as Organization[]
        );
        state.status = 'idle';
      })
      .addCase(getOrganizationsAsync.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(updateOrganizationAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateOrganizationAsync.fulfilled, (state, action) => {
        state.status = 'idle';
      })
      .addCase(updateOrganizationAsync.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(createOrganizationAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrganizationAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        // state.organizations = [...state.organizations, action.payload].filter(
        //   (item) => item?.id
        // );
      })
      .addCase(createOrganizationAsync.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(deleteOrganizationAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteOrganizationAsync.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(deleteOrganizationAsync.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(getOrganizationStatsAsync.fulfilled, (state, action) => {
        state.organizationStats = action.payload.data;
        state.status = 'idle';
      })
      .addCase(getOrganizationStatsAsync.rejected, (state, action) => {
        state.organizationStats = {
          users: 0,
          sites: 0,
          orgAdmins: 0,
        };
        state.status = 'failed';
      })
      .addCase(getPostLogoutRedirectUrl.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPostLogoutRedirectUrl.fulfilled, (state, action) => {
        state.postLogoutRedirectUrl =
          action?.payload?.data?.postLogoutRedirectUrl;
        state.status = 'idle';
      })
      .addCase(getPostLogoutRedirectUrl.rejected, (state) => {
        state.status = 'failed';
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
  updateAddress,
  resetOrganization,
  setOrgFormModified,
} = organizationsSlice.actions;

export const selectOrganizations = (state: RootState) =>
  state.organizations.organizations;
export const selectedId = (state: RootState) => state.organizations.selectedId;
//exporting organization
export const selectedOrganization = (state: RootState) =>
  state.organizations.organization;

export const getOrgFormModified = (state: RootState) => {
  return state.organizations.orgFormModified;
};

export const organizationStats = (state: RootState) =>
  state.organizations.organizationStats;

export const allOrgDomains = (state: RootState) =>
  state.organizations.allOrgDomains.map((org) => org.domainName);

export const postLogoutRedirectUrl = (state: RootState) =>
  state.organizations.postLogoutRedirectUrl;

export const selectOrganizationByDomain = (state: RootState, email: string) => {
  //strip email part and do domain
  const domain = email.split('@')[1];
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
  const org = state.organizations.organizations.find((p) =>
    p.orgCode?.includes(orgCode)
  );
  const root = org?.root;
  return root;
};

export const organizationList = (state: RootState) =>
  state.organizations.organizations.map(function (organization) {
    return organization['name'];
  });

export const getOrgCodeFromName = (state: RootState) => {
  const org = state.organizations.organizations;
  return org;
};

export const organizationsReducer = organizationsSlice.reducer;
