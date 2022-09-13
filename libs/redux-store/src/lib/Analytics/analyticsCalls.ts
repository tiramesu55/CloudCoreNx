import { createAsyncThunk } from '@reduxjs/toolkit';
import { setAccessToken } from './analyticsSlice';
import { IEmbedTokenRequest, IEmbedTokenResponse, IAccessTokenResponse, DataSetResponse } from './analyticsTypes';

const reportingApiRoot = process.env['NX_REACT_APP_REPORTS_API_BASE_URL'];
const powerBiRoot = 'https://api.powerbi.com/v1.0/myorg';

const accessTokenEndPoint = `${reportingApiRoot}/powerbi-token`;
const refreshDateEndPoint = `${reportingApiRoot}/powerbi-refresh-history`;
const embedTokenEndPoint = `${reportingApiRoot}/powerbi-embedtoken`;
const reportsListEndPoint = `${reportingApiRoot}/powerbi-reports`;

const workspaceId = '9ff0ac9f-8a38-42e9-be4b-d354a48bc434';
const datasetId = '7ea29b1d-8ed4-422f-bd1c-8b959dbb1b7a';
const apiKey = '4f6571679b4949a9b964cc0390172c00';

export const getReports = createAsyncThunk('analytics/getReports', async (mock: string, { rejectWithValue }) => {
    //@alc todo: don`t need first param, but typescript errors out without it.   Figure out
    const localStore: any = localStorage.getItem('LOX_USER');
    const user = JSON.parse(localStore);

    const tokenHeaders = {
        'x-contract-id': user ? user.profile.contract : '',
        'Authorization': user ? `Bearer ${user.access_token}` : '',
    };

    const config = {
        method: 'GET',
        headers: {
            'Authorization': tokenHeaders.Authorization,
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'X-CONTRACT-ID': tokenHeaders['x-contract-id'],
        },
    };

    try {
        const response = await fetch(reportsListEndPoint, config).then((response) => response.json());
        return response.result.code !== 0 ? rejectWithValue(response.result.message) : response.payload;
    } catch (err: any) {
        return rejectWithValue({
            message: err.toString(),
            code: 'codegetReportsError',
        });
    }
});

export const getDataset = createAsyncThunk('analytics/getDataset', async (mock: string, { rejectWithValue }) => {
    const localStore: any = localStorage.getItem('LOX_USER');
    const user = JSON.parse(localStore);

    const tokenHeaders = {
        'x-contract-id': user ? user.profile.contract : '',
        'Authorization': user ? `Bearer ${user.access_token}` : '',
    };

    const config = {
        method: 'GET',
        headers: {
            'Authorization': tokenHeaders.Authorization,
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'X-CONTRACT-ID': tokenHeaders['x-contract-id'],
        },
    };

    try {
        const response = await fetch(refreshDateEndPoint, config).then((response) => response.json());
        return response.result.code !== 0 ? rejectWithValue(response.result.message) : response.payload;
    } catch (err) {
        return console.log(err);
    }
});

export const getEmbedToken = createAsyncThunk(
    'analytics/getEmbedToken',
    async (request: IEmbedTokenRequest, { rejectWithValue }) => {
        const newreq: any = Object.assign({}, request);
        delete newreq.uniqId;

        const localStore: any = localStorage.getItem('LOX_USER');
        const user = JSON.parse(localStore);

        const embedTokenForReportEndpoint = `${embedTokenEndPoint}/?reportId=${newreq.reports[0].id}`;

        const tokenHeaders = {
            'x-contract-id': user ? user.profile.contract : '',
            'Authorization': user ? `Bearer ${user.access_token}` : '',
        };

        const config = {
            method: 'GET',
            headers: {
                'Authorization': tokenHeaders.Authorization,
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'X-CONTRACT-ID': tokenHeaders['x-contract-id'],
            },
        };

        try {
            const response: IEmbedTokenResponse = await fetch(embedTokenForReportEndpoint, config).then((response) =>
                response.json()
            );
            return response.result?.errors.length ? rejectWithValue(response.result?.errors[0]) : response.payload;
        } catch (err: any) {
            return rejectWithValue({
                message: err.toString(),
                code: 'codegetEmbedTokenError',
            });
        }
    }
);

export const getAccessToken = createAsyncThunk(
    'analytics/getAccessToken',
    async (accessToken: string, { rejectWithValue, dispatch }) => {
        if (accessToken) {
            dispatch(setAccessToken(accessToken));
            dispatch(getReports('mock'));
            dispatch(getDataset('mock'));
            return { accessToken };
        } else {
            const localStore: any = localStorage.getItem('LOX_USER');
            const user = JSON.parse(localStore);

            const tokenHeaders = {
                'x-contract-id': user ? user.profile.contract : '',
                'Authorization': user ? `Bearer ${user.access_token}` : '',
            };

            const config = {
                method: 'GET',
                headers: {
                    'Authorization': tokenHeaders.Authorization,
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'X-CONTRACT-ID': tokenHeaders['x-contract-id'],
                },
            };

            try {
                const response: IAccessTokenResponse = await fetch(accessTokenEndPoint, config).then((response) =>
                    response.json()
                );
                dispatch(setAccessToken(response.payload.accessToken));
                dispatch(getReports('mock'));
                dispatch(getDataset('mock'));
                return response.result.code !== 0 ? rejectWithValue(response.result.message) : response.payload;
            } catch (err: any) {
                return rejectWithValue({
                    message: err.toString(),
                    code: 'codegetAccessTokenError',
                });
            }
        }
    }
);
