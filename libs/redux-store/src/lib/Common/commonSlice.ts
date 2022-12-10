import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CommonState {
  openAlert: boolean;
  type: 'success' | 'info' | 'error' | 'warning';
  content: string;
}

interface ActionPayload {
  type: 'success' | 'info' | 'error' | 'warning';
  content: string;
}

const initialState: CommonState = {
  openAlert: false,
  type: 'error',
  content: '',
};

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
});
export const { openAlertAction, closeAlertAction } = commonSlice.actions;
export const commonReducer = commonSlice.reducer;
