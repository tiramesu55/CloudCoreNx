import { ReportBiClientComponent } from '@cloudcore/powerbi';
import { Backdrop as BackdropPowerBi } from '@cloudcore/ui-shared';
import { IFilterReport } from '@cloudcore/common-lib';

export interface PowerbiReportProps {
  selectedReportId: string;
  handleOpenAlert: (message: string, status: number)  => void;
  handleLoadingReportSingle: (data: boolean) => void;
  handleSelectFilterItemSelected: (filter: string[], operator: string) => void;
  reportFilter:  IFilterReport | undefined;
  loadingSingleReport: boolean;
  userName: string;
  userEmail: string;
}

export function PowerbiReport(props: PowerbiReportProps) {
  const {
    selectedReportId,
    handleOpenAlert,
    handleLoadingReportSingle,
    handleSelectFilterItemSelected,
    reportFilter,
    loadingSingleReport,
    userName,
    userEmail
  } = props;

  return (
    <>
       <ReportBiClientComponent
        userName={userName}
        userEmail={userEmail}
        reset={() => null}
        openAlert={handleOpenAlert}
        loadingReportSingle={handleLoadingReportSingle}
        selectFilterItemSelected={handleSelectFilterItemSelected}
        selectedReport={{ reportId: selectedReportId, reportName: '' }}
        reportFilter={reportFilter}
      />
      <BackdropPowerBi open={loadingSingleReport} />
      </>
  );
}

export default PowerbiReport;
