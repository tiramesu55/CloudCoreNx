import { createSlice, PayloadAction, AsyncThunk, AnyAction } from '@reduxjs/toolkit';
import { getReports, getDataset, getEmbedToken, getAccessToken } from './analyticsCalls';
import { ReportState } from './analyticsTypes';

const initialState: ReportState = {
    reports: [],
    loading: false,
    lastRefresh: '',
    accessToken: '',
    embedData: {
        reportId: '',
        isError: false,
    },
    latestActiveReport: undefined,
};

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>;

function isPendingAction(action: AnyAction): action is PendingAction {
    return action.type.endsWith('/pending') && action.type.indexOf('getEmbedToken') === -1;
}
function isRejectedAction(action: AnyAction): action is RejectedAction {
    return action.type.endsWith('/rejected');
}
function isFulfilledAction(action: AnyAction): action is FulfilledAction {
    return action.type.endsWith('/fulfilled');
}

export const reportSlice = createSlice({
    name: 'reportSlice',
    initialState,
    reducers: {
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        setRefresh: (state, action: PayloadAction<string>) => {
            state.lastRefresh = action.payload;
        },
        removeReportFromActiveAction: (state, action: PayloadAction<string>) => {
            console.log('call remove from Active active');
            const id = action.payload.split('_')[0];
            const report = state.reports.find((el) => el.id === id);
            if (report) {
                report.activeReports = report.activeReports.filter((el) => el !== action.payload);
                state.reports = state.reports.map((el) => (el.id === action.payload && report ? report : el));
            }
        },
        addReportToActiveAction: (state, action: PayloadAction<string>) => {
            console.log('add to  active');
            //find report by id in the reports coillection
            //const newActive = state.reports?.find(el => el.id === action.payload);
            //because there is immer we shouldn't warry about copying state?

            const report = state.reports.find((el) => el.id === action.payload);
            if (report) {
                report.activeReports.push(`${action.payload}_${Math.random().toString(36).substr(2, 4)}`);
                state.reports = state.reports.map((el) => (el.id === action.payload && report ? report : el));
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getReports.fulfilled, (state, { payload }) => {
                state.reports = payload.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    datasetId: p.datasetId,
                    embedUrl: p.embedUrl,
                    popWindow: null,
                    isActive: false,
                    category: p.category,
                    activeReports: [],
                    embedTokenData: {
                        '@odata.context': '',
                        'expiration': '',
                        'token': '',
                        'tokenId': '',
                    },
                    isPending: false,
                    isLoaded: false,
                }));
            })
            .addCase(getDataset.fulfilled, (state, { payload }) => {
                const refreshTime = payload?.[0]?.endTime;
                if (refreshTime) {
                    state.lastRefresh = refreshTime;
                }
            })
            .addCase(getEmbedToken.pending, (state, { meta }) => {
                const reportId = meta.arg.reports[0].id;
                state.embedData = initialState.embedData;
                state.reports = state.reports.map((item) =>
                    item.id === reportId
                        ? {
                              ...item,
                              isPending: true,
                              isLoaded: false,
                          }
                        : item
                );
            })
            .addCase(getEmbedToken.fulfilled, (state, { payload, meta }) => {
                const reportId = meta.arg.reports[0].id;
                state.embedData = {
                    reportId,
                    isError: false,
                };
                state.reports = state.reports.map((item) =>
                    item.id === reportId
                        ? {
                              ...item,
                              embedTokenData: {
                                  ...payload,
                              },
                              isPending: false,
                              isLoaded: true,
                          }
                        : item
                );
            })
            .addCase(getEmbedToken.rejected, (state, { meta }) => {
                const reportId = meta.arg.reports[0].id;
                state.embedData = {
                    isError: true,
                    reportId,
                };
                state.reports = state.reports.map((item) =>
                    item.id === reportId
                        ? {
                              ...item,
                              isPending: false,
                              isLoaded: false,
                          }
                        : item
                );
            })

            .addMatcher(isPendingAction, (state) => {
                state.loading = true;
            })
            .addMatcher(isRejectedAction, (state) => {
                state.loading = false;
            })
            .addMatcher(isFulfilledAction, (state) => {
                state.loading = false;
            });
    },
});
export const {
    setAccessToken,
    setRefresh,
    addReportToActiveAction,
    removeReportFromActiveAction,
} = reportSlice.actions;

export default reportSlice.reducer;
