import { useParams } from 'react-router-dom';
import { ReportBiClientComponent } from '@cloudcore/powerbi';
import { BackdropPowerBi } from '@cloudcore/analytics/powerbi';
import { analyticsStore, reportsActions } from '@cloudcore/redux-store';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ConfigCtx, IConfig } from '@cloudcore/okta-and-config';
type PartnerParams = {
  id: string;
};
/* eslint-disable-next-line */
export interface PowerbiReportProps {}

export function PowerbiReport(props: PowerbiReportProps) {
  const { id } = useParams<PartnerParams>();
  const config: IConfig = useContext(ConfigCtx)!;

  const { useAppDispatch, useAppSelector } = analyticsStore;
  const dispatch = useAppDispatch();
  const {
    loadReports,
    openAlert,
    loadingReportSingle,
    selectFilterItemSelected,
    selectReport,
  } = reportsActions;

  const reportId =
    id === undefined
      ? config.marketplaceReports[0]
      : id === '1'
      ? config.marketplaceReports[1]
      : config.marketplaceReports[2];
  //throw new Error('xxxxxxx')
  const { loadingSingleReport, reportFilter } = useAppSelector(
    (state) => state.report
  );

  const sessionTimeoutRef: any = useRef(null);

  const handleOpenAlert = (message: string, status: number) =>
    dispatch(openAlert(message, status));

  const handleLoadingReportSingle = (data: boolean) =>
    dispatch(loadingReportSingle(data));

  const handleSelectFilterItemSelected = (filter: string[], operator: string) =>
    dispatch(selectFilterItemSelected(filter, operator));

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div>
          <h1>An error occurred: {error.message}</h1>
          <button onClick={resetErrorBoundary}>Try again</button>
        </div>
      )}
    >
      <ReportBiClientComponent
        userName=""
        userEmail="wag@walgreens.com"
        reset={() => null}
        openAlert={handleOpenAlert}
        loadingReportSingle={handleLoadingReportSingle}
        selectFilterItemSelected={handleSelectFilterItemSelected}
        selectedReport={{ reportId: reportId, reportName: '' }}
        reportFilter={reportFilter}
      />
      <BackdropPowerBi loadingState={loadingSingleReport} />
    </ErrorBoundary>
  );
}

export default PowerbiReport;
