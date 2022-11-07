/* eslint-disable no-throw-literal */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as pbi from 'powerbi-client';
import { IEmbedConfiguration, IEmbedSettings } from 'powerbi-client';
import * as models from 'powerbi-models';
import { IUiReport,IFilterReport, IErrorTypeResponse } from "@cloudcore/common-lib";

interface IReportEmbedModel {
  id: string;
  embedUrl: string;
  accessToken: string;
}

export default class ReportEmbedding {
  private pbiService: pbi.service.Service;

  constructor() {
    this.pbiService = new pbi.service.Service(
      pbi.factories.hpmFactory,
      pbi.factories.wpmpFactory,
      pbi.factories.routerFactory
    );
  }

  public setActualToken(hostContainer: HTMLDivElement, token: string) {
    const report = this.pbiService.get(hostContainer);
    return report.setAccessToken(token);
  }

  public setActualHeight(hostContainer: HTMLDivElement) {
    const { innerHeight: height } = window;
    hostContainer.style.height = `${height - 100}px`;
  }

  public resetElem(hostContainer: HTMLDivElement): void {
    this.pbiService.reset(hostContainer);
  }

  public embedReport(
    reportInfo: IUiReport,
    hostContainer: HTMLDivElement,
    showMobileLayout: boolean,
    token: string,
    powerbiUrl: string,
    handleErrorOrLogResponse: (err: IErrorTypeResponse) => void,
    loadingReportSingle: (v: boolean) => void,
    actualReportFilter: IFilterReport | undefined,
    selectFilterItemSelected: (t: string[], p: string) => void,
    reset: () => void
  ): void {
    const timeStartLoad = new Date().getTime();
   //getReportEmbedModel actually calls HTTP fetch
    this.getReportEmbedModel(reportInfo, token, powerbiUrl, loadingReportSingle)
      .then((apiResponse) => this.getReportEmbedModelFromResponse(apiResponse))
      .then((responseContent) =>
        this.buildReportEmbedConfiguration(responseContent, showMobileLayout)
      )
      .then((reportConfiguration) =>
        this.runEmbedding(
          reportConfiguration,
          hostContainer,
          reportInfo,
          showMobileLayout,
          loadingReportSingle,
          actualReportFilter,
          selectFilterItemSelected,
          handleErrorOrLogResponse,
          timeStartLoad,
          reset
        )
      )
      .catch((err) => {
        loadingReportSingle(false);
        console.error('getReportEmbedModel') //@
        let errorText;
        try {
          const errorData = JSON.parse(err.message);
          errorText = JSON.parse(errorData.text);
          handleErrorOrLogResponse({
            type: errorData.type? errorData.type : "GetReportError",
            message: errorText.message? errorText.message : errorText,
            status: errorData.status,
            justEventSend: false,
            messageToShow: errorText.messageToShow? errorText.messageToShow : errorText
          });
        } catch (e) {
          errorText = err.text;
          handleErrorOrLogResponse({
            type: "GetReportError",
            message: errorText,
            status: 501,
            justEventSend: false,
            messageToShow: errorText
          });
        }        
      });
  }

  private getReportEmbedModel(
    reportInfo: IUiReport,
    token: string,
    powerbiUrl: string,
    loadingReportSingle: any
  ): Promise<Response> {
    const request = new Request(powerbiUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
      body: JSON.stringify({ reportId : reportInfo.reportId }),
    });
    loadingReportSingle(true);
    return fetch(request);
  }

  private getReportEmbedModelFromResponse(response: Response): Promise<any> {
    if(!response.ok) {
      return response.text().then(text => { throw new Error(JSON.stringify({ text, status: response.status })) })
     }
    else {
     return response.json();
   } 
  }

  private buildReportEmbedConfiguration(
    embedModel: IReportEmbedModel,
    showMobileLayout: boolean
  ): IEmbedConfiguration {
    const layoutSettings = {
      displayOption: models.DisplayOption.FitToPage,
    } as models.ICustomLayout;

    const renderSettings = {
      filterPaneEnabled: false,
      navContentPaneEnabled: false,
      layoutType: showMobileLayout
        ? models.LayoutType.MobilePortrait
        : models.LayoutType.Custom,
      customLayout: layoutSettings,
    } as IEmbedSettings;

    return {
      id: embedModel.id,
      embedUrl: embedModel.embedUrl,
      accessToken: embedModel.accessToken,
      type: 'report',
      tokenType: pbi.models.TokenType.Embed,
      permissions: pbi.models.Permissions.Read,
      settings: renderSettings,
    } as IEmbedConfiguration;
  }

  private runEmbedding(
    reportConfiguration: IEmbedConfiguration,
    hostContainer: HTMLDivElement,
    _reportInfo: IUiReport,
    showMobileLayout: boolean,
    loadingReportSingle: any,
    actualReportFilter: IFilterReport | undefined,
    selectFilterItemSelected: any,
    handleErrororLogResponse:  (err: IErrorTypeResponse) => void,
    timeStartLoad: number,
    reset: () => void
  ): void {
    // debugger;
    const report = this.pbiService.embed(
      hostContainer,
      reportConfiguration
    ) as pbi.Report;

    report.off('loaded');
    report.off('error');

    report.on('loaded', () => {
      handleErrororLogResponse({
        type: "GetReportLoading",
        message: JSON.stringify({
          reportId: _reportInfo.reportId,
          reportName:  _reportInfo.reportName,
          reportLoadTime: new Date().getTime() - timeStartLoad
        }),
        status: 0,
        messageToShow: "",
        justEventSend: true
      });
      this.setContainerHeight(report, hostContainer, showMobileLayout, selectFilterItemSelected, actualReportFilter)
        .then(() => this.showReport(hostContainer))
        .then(() => loadingReportSingle(false));
    });
    report.on('rendered', (event: any) => {
      report.getPages().then((pages: any) => {
        pages[0].getVisuals().then((visuals: any) => {
          const slicer = visuals.find((slicer: any) => slicer.type === 'slicer' && slicer.title === "Location");
          if(slicer){
            slicer.getSlicerState().then((slicerState: any) => {
              if(slicerState && slicerState.filters.length === 0){
                selectFilterItemSelected([], "In")
              } else if(slicerState && slicerState.filters.length > 0){
                selectFilterItemSelected(slicerState.filters[0].values, slicerState.filters[0].operator)
              }
            })
          }
        });
      });
    });
    report.on('error', (e: any) => {
      const error = e.detail as models.IError;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (error.level! > models.TraceType.Error) {

        console.log('Embedded Error: ', error);
        handleErrororLogResponse({
          type: "GetReportError",
          message: error.detailedMessage,
          status: 0,
          messageToShow: error.detailedMessage
        });
      }
      loadingReportSingle(false);
      //need to remove tell react to stop progress indicator which is animated gif
    });
    report.on('visualClicked', () => {
      reset();
    })
  }

  private setContainerHeight(
    report: pbi.Report,
    hostContainer: HTMLDivElement,
    showMobileLayout: boolean,
    selectFilterItemSelected: any,
    actualReportFilter: IFilterReport | undefined,
  ) {
    const { innerHeight: height } = window;
    return report.getPages().then(async (p: Array<pbi.Page>) => {
      const visuals = await p[0].getVisuals();
      const slicer = visuals.find((slicer: any) => slicer.type === 'slicer' && slicer.title === 'Location');
      if(slicer){
        if(actualReportFilter){
            slicer.getSlicerState().then((slicerState: any) => {
              if( actualReportFilter.filterItem.length === 0){
                slicer && slicer.setSlicerState({...slicerState, filters: []})
              } else { 
                if(slicer && actualReportFilter.operator === "In"){
                  slicer.setSlicerState({...slicerState, filters: [{
                    $schema: "http://powerbi.com/product/schema#basic",
                    filterType: 1,
                    operator: actualReportFilter.operator,
                    requireSingleSelection: false,
                    target: slicerState.targets[0],
                    values: actualReportFilter.filterItem
                  }]})
                } else if (slicer && actualReportFilter.operator === "NotIn"){
                  slicer.setSlicerState({...slicerState, filters: []}).then(() => {
                    slicer && slicer.setSlicerState({...slicerState, filters: [{
                      $schema: "http://powerbi.com/product/schema#basic",
                      filterType: 1,
                      operator: actualReportFilter.operator,
                      requireSingleSelection: false,
                      target: slicerState.targets[0],
                      values: actualReportFilter.filterItem
                    }]})
                  });
                }
              }
            })
        } else {
          slicer.getSlicerState().then((slicerState: any) => {
            slicer && selectFilterItemSelected(slicerState.filters.length > 0? slicerState.filters[0].values : [], slicerState.filters[0]? slicerState.filters[0].operator : undefined);
          })
        }
      }
      p[0]
        .hasLayout(models.LayoutType.MobilePortrait)
        .then((hasMobileLayout: any) => {
          if (!hasMobileLayout || !showMobileLayout) {
            hostContainer.style.height = `${height - 69}px`;
          }
        });
    });
  }
  //Code Developed by Alec Goldis
  private showReport(hostContainer: HTMLDivElement): void {
    window.setTimeout(() => {
      hostContainer.style.visibility = 'visible';
    }, 50);
  }
}
