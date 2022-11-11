import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import { RootState } from "../../store-platform";
import {
  getUsersApi,
  updateUserApi,
  addUserApi,
  deleteUserApi,
  addMultipleUsers
} from "./userAPI";

interface UsersGetAction{
  data: User[];
  type: string;
}

interface UserAction{
  data: User;
  type: string;
}

interface UserFile{
  file: File;
  name:string;
  organization:string;
}

interface UserFileUploadAction{
  data:UserFile;
  type:string;
}

interface Iaddress {
  street: string;
  state: string;
  city: string;
  zip: string;
}

export interface Role {
  role: string;
  permissions: string[];
}
export interface SiteUser {
  siteCode: string;
  siteId: string;
}

export interface ApplicationUser {
  id?: string;
  appCode: string;
  roles: Role[];
  sites: SiteUser[];
}
export interface PartialApplication {
  appCode: string;
  roles: Role[];
}
export interface PartialSite {
  appCode: string;
  sites: SiteUser[];
}
export interface User {
  address: Iaddress;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  title: string;
  officeAddress?: null;
  applications: ApplicationUser[];
  id: string;
  orgCode: string;
  inactiveDate: Date | null;
  startDate?: Date;
  endDate?: Date;
  createdBy?: string;
  modifiedBy?: string;
  createdDate: Date;
  modifiedDate: Date;
}

export interface UserState {
  users : User[]
  selectedId: string;
  status: "idle" | "loading" | "failed";
  error: string;
  //we store applications for the selected or new user
  applications: ApplicationUser[];
  userFormModified : boolean;
}

const userAdapter = createEntityAdapter<User>({
  sortComparer: (a, b) => a.firstName.localeCompare(b.firstName),
  selectId: (usr) => usr.id,
});

const initialState = userAdapter.getInitialState<UserState>({
  users : [],
  status: "idle",
  error: "",
  selectedId: "",
  applications: [],
  userFormModified : false,
});

export const fetchUsers = createAsyncThunk<UsersGetAction, any, {state:RootState}>(
  "users/fetchUsers",
  async ({ url, token } : {url: string, token: string}, {getState}) => {
    if(!token)
    return {data: [],type: "getAll"}
    const response = await getUsersApi(url, token);
        // The value we return becomes the `fulfilled` action payload
        return {
          data: response.data,
          type: "getAll",
        };
  }
);

export const importUserFile = createAsyncThunk<UserFileUploadAction, any, {state:RootState}>(
  "users/importUserFile",
  async ({ upload, url, token } : {upload:FormData, url: string, token: string}, {getState}) => {
  //async (upload:FormData, {getState}) => {
    // const state = getState();
    // const token = state.config.authToken;
    // const url = state.config.baseUrl;
    if(!token)
    return {data: [],  type: "getAll"}
    const response = await addMultipleUsers(url, token, upload );
        // The value we return becomes the `fulfilled` action payload      
        return {
          data: response.data,
          type: "getAll",
        };
  }
);

export const updateUser = createAsyncThunk<UserAction,any, {state:RootState}>(
  "users/updateUser",
  async ({ user, url, token }:{user: User, url: string, token: string}, {getState}) => {
    if(!token)
    {
      return {data: null,type: "updateOne"}
    }

    const response = await updateUserApi(url, token, user);
      // The value we return becomes the `fulfilled` action payload
      return {
        data: response.data,
        type: "updateOne",
      };
  }
);

export const addNewUser = createAsyncThunk<UserAction,any, {state:RootState}>(
  "users/addNewUser",
  async ({user, url, token} : {user: User, url: string, token: string}, {getState}) => {
    if(!token)
    return {data: null,type: "addOne"}
    const response = await addUserApi(url, token, user);
    // The value we return becomes the `fulfilled` action payload
    return {
      data: response.data,
      type: "addOne",
    };
  }
);

export const deleteUser = createAsyncThunk<UserAction,any, {state:RootState}>(
  "Users/deleteUser",
  async ({ user, url, token } : {user: User, url: string, token: string}, {getState}) => {
    if(!token)
    return {data: null,type: "updateOne"}
    const { id } = user;
    const response = await deleteUserApi(url, token, id)
      // The value we return becomes the `fulfilled` action payload
      return {
        data: response.data,
        type: "updateOne",
      };
  }
);

const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    selectUserID: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
      //if new user is selected from grid we need to set applications for that user
      const selected = userAdapter
        .getSelectors()
        .selectById(state, action.payload);
      //  state.applications
      state.applications = selected ? selected?.applications : [];
    },
    updatePartialApp: (state, action: PayloadAction<PartialApplication>) => {
      //get sites from matcing app
      const sites =
        state.applications !== null
          ? state.applications.find(
              (p) =>
                p.appCode.toLowerCase() === action.payload.appCode.toLowerCase()
            )?.sites
          : [];
      //get all apps, but the one we changing
      const untouochedApps =
        state.applications !== null
          ? state.applications.filter(
              (p) =>
                p.appCode.toLowerCase() !== action.payload.appCode.toLowerCase()
            )
          : [];
      //push apps
      const app: ApplicationUser = {
        appCode: action.payload.appCode,
        sites: ((sites === null) || (sites === undefined)) ? [] : sites,
        roles: action.payload.roles,
      };
      if((sites && sites.length > 0) || (action.payload.roles && action.payload.roles.length > 0))
      {
        untouochedApps.push(app);
      }
      //immer supposed to handle mutation below.  Need to test
      //@todo see if state changing
      state.applications = untouochedApps;
    },
    updatePartialSite: (state, action: PayloadAction<PartialSite>) => {
      //extract roles
      const roles = state.applications !== null
      ? state.applications.find(
        (p) => p.appCode.toLowerCase() === action.payload.appCode.toLowerCase()
      )?.roles : [];
      const untouochedApps =  state.applications !== null
      ? state.applications.filter(
        (p) => p.appCode.toLowerCase() !== action.payload.appCode.toLowerCase()
      ) : [];
      const app: ApplicationUser = {
        appCode: action.payload.appCode,
        roles: ((roles === null) || (roles === undefined)) ? [] : roles,
        sites: action.payload.sites,  
      };
      if((roles && roles.length > 0) ||(action.payload.sites && action.payload.sites.length > 0))
      {
        untouochedApps.push(app);
      }
      state.applications = untouochedApps;
    },
    setUserFormModified : (state, action : PayloadAction<boolean>)=> {
      state.userFormModified = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload.data;
        userAdapter.upsertMany(state, action.payload.data as User[]);
        state.status = "idle";
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message!;
      })
      .addCase(updateUser.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(addNewUser.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(addNewUser.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(addNewUser.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(deleteUser.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(importUserFile.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(importUserFile.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(importUserFile.rejected, (state, action) => {
        state.status = "failed";
      })
  },
});

export const { selectAll: allUsers, selectIds: selectUserIds } =
  userAdapter.getSelectors((state: RootState) => state.user);

const { selectById } = userAdapter.getSelectors();

export const selectUserByIdState = (state: RootState) => state.user;

export const getUserFormModified = (state: RootState) => state.user.userFormModified;

export const selectUserByIdEntity = (id: string) => {
  return createSelector(selectUserByIdState, (state) => selectById(state, id));
};

export const selectedUserEmail = (state: RootState) => state.user.selectedId;

export const usersDomain = (state: RootState) => {
  const domains = state.user.users.map(user => user.email.split("@")[1])
  return domains.filter((d, index) => {
    return domains.indexOf(d) === index;
  });
}

export const { selectUserID, updatePartialApp, updatePartialSite, setUserFormModified } =
  usersSlice.actions;

export const currentApps = (state: RootState) => state.user.applications;

export const userReducer = usersSlice.reducer;
//export default usersSlice.reducer;
