import { ReportBiClientComponent } from '@cloudcore/powerbi';
import { Backdrop as BackdropPowerBi } from '@cloudcore/ui-shared';
import { IFilterReport, IAlert, IAlertData } from '@cloudcore/common-lib';

export interface PowerbiReportProps {
  selectedReportId: string;
  handleOpenAlert: (payload: IAlert)  => void;
  handleCloseAlert: ()  => void;
  handleLoadingReportSingle: (data: boolean) => void;
  handleSelectFilterItemSelected: (filter: string[], operator: string) => void;
  reportFilter:  IFilterReport | undefined;
  loadingSingleReport: boolean;
  userName: string;
  userEmail: string;
  alertData: IAlertData;
}

export function PowerbiReport(props: PowerbiReportProps) {
  const {
    selectedReportId,
    handleOpenAlert,
    handleCloseAlert,
    handleLoadingReportSingle,
    handleSelectFilterItemSelected,
    reportFilter,
    loadingSingleReport,
    userName,
    userEmail,
    alertData
  } = props;

  return (
    <>
       <ReportBiClientComponent
        userName={userName}
        userEmail={userEmail}
        reset={() => null}
        openAlert={handleOpenAlert}
        closeAlert={handleCloseAlert}
        loadingReportSingle={handleLoadingReportSingle}
        selectFilterItemSelected={handleSelectFilterItemSelected}
        selectedReport={{ reportId: selectedReportId, reportName: '' }}
        reportFilter={reportFilter}
        alertData={alertData}
      />
      <BackdropPowerBi open={loadingSingleReport} />
      </>
  );
}

export default PowerbiReport;
