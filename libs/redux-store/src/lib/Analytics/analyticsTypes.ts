export interface Report {
    id: string;
    name: string;
    datasetId: string;
    embedUrl: string;
    isActive: boolean;
    category: string;
    //service property
    popWindow: WindowProxy | null;
    activeReports: string[];
    embedTokenData: IEmbedTokenData;
    isPending: boolean;
    isLoaded: boolean;
}
export interface EmbedData {
    reportId?: string;
    isError?: boolean;
}
export interface Actives extends Report {
    uniqId: string;
}
export interface IApiError {
    code: number;
    message: string;
    correlationId: string;
    errors: string[];
}

export interface IAccessTokenData {
    expiresIn: number;
    accessToken: string;
    expiresOn: string;
}
export interface IAccessTokenResponse {
    result: IApiError;
    payload: IAccessTokenData;
}

export interface IEmbedTokenRequest {
    datasets: { id: string }[];
    reports: { id: string }[];
}
export interface IEmbedTokenResponse {
    result: IEmbedTokenResponseResult;
    payload: IEmbedTokenResponsePayload;
}

export interface IEmbedTokenResponsePayload {
    '@odata.context'?: string;
    'expiration'?: string;
    'token'?: string;
    'tokenId'?: string;
    'error'?: ErrorResponse;
    'Message'?: string;
}

export interface IEmbedTokenResponseResult {
    "apiVer": string;
    "code": number;
    "correlationId": string;
    "errors": any[];
}

export interface IEmbedTokenData {
    '@odata.context'?: string;
    'expiration'?: string;
    'token'?: string;
    'tokenId'?: string;
}

export interface DatasetItem {
    id?: number;
    refreshType?: string;
    startTime?: string;
    endTime?: string;
    status?: string;
    requestId?: string;
}

export interface DataSetResponse {
    '@odata.context'?: string;
    'value'?: DatasetItem[];
    'error'?: ErrorResponse;
}

export interface ReportItem {
    datasetId: string;
    embedUrl: string;
    id: string;
    isFromPbix?: boolean;
    isOwnedByMe?: boolean;
    name: string;
    category: string;
    reportType?: string;
    users?: any;
    webUrl?: string;
}

export interface ReportsResponse {
    '@odata.context'?: string;
    'value'?: ReportItem[];
    'error'?: ErrorResponse;
}

export interface ErrorReportsResponse {
    error: ErrorResponse;
}

interface ErrorResponse {
    code: string;
    message: string;
}
export interface ReportState {
    accessToken: string;
    lastRefresh: string;
    loading: Boolean;
    reports: Report[];
    latestActiveReport: Report | undefined;
    embedData: EmbedData;
}

export interface IReportProps {
    report: Actives;
    unMountReport: any;
    closeWindow?: boolean;
}

export interface IPopUpWindowProps {
    unMountReport: any;
    report: Actives;
    height: number;
    width: number;
    loaded: Boolean;
    children: any;
    externalWindow: any;
    setExternalWindow: any;
}

export interface IProps {
    report: Actives;
    setStateData: any;
    loaded: boolean;
    handleCloseWindow: any;
    height: number;
}
export interface IPopUpHeaderProps {
    reportName: string;
}
