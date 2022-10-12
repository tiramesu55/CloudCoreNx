import {  useParams} from "react-router-dom";
import { ReportBiClientComponent } from '@cloudcore/powerbi';
import { BackdropPowerBi } from '@cloudcore/analytics/powerbi';
import { analyticsStore, reportsActions } from '@cloudcore/redux-store';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';

type PartnerParams = {
  id: string;
};
/* eslint-disable-next-line */
export interface PowerbiReportProps {}

export function PowerbiReport(props: PowerbiReportProps) {
  const { id } = useParams<PartnerParams>();
  const { useAppDispatch, useAppSelector } = analyticsStore;
  const dispatch = useAppDispatch();
  const {
    loadReports,
    openAlert,
    loadingReportSingle,
    selectFilterItemSelected,
    selectReport,
  } = reportsActions;

  const { loadingSingleReport, selectedReportId, reportFilter, reports } =  useAppSelector((state) => state.report);

  const sessionTimeoutRef: any = useRef(null);

  const handleOpenAlert = (message: string, status: number) =>
    dispatch(openAlert(message, status));

  const handleLoadingReportSingle = (data: boolean) =>
    dispatch(loadingReportSingle(data));

    const handleSelectFilterItemSelected = (filter: string[], operator: string) =>
    dispatch(selectFilterItemSelected(filter, operator));

  return (
    <>
    <ReportBiClientComponent
      userName= ''
      userEmail= 'wag@walgreens.com'
      reset={() => (null)  }
      openAlert={handleOpenAlert}
      loadingReportSingle={handleLoadingReportSingle}
      selectFilterItemSelected={handleSelectFilterItemSelected}
      selectedReportId={'3c7d3cd2-a042-4632-b88e-73517df4678d'}
      reportFilter={reportFilter}
    />
    <BackdropPowerBi loadingState={loadingSingleReport} />
  </>
  );
}

export default PowerbiReport;
