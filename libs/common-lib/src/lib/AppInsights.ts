import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory, BrowserHistoryOptions } from 'history';
import {GetConfig} from "./services/service";

let appInsights: ApplicationInsights | null = null;
const browserHistory = createBrowserHistory({ basename: '' } as BrowserHistoryOptions);
const reactPlugin = new ReactPlugin() as any;
const appInsightsFunc = async () => { 
  const config = await GetConfig();
  appInsights  = new ApplicationInsights({
      config: {
          instrumentationKey: config.instrumentationKey,
          extensions: [reactPlugin],
          extensionConfig: {
            [reactPlugin.identifier]: { history: browserHistory }
          }
      }
  });
  appInsights.loadAppInsights();
}
appInsightsFunc();
export { reactPlugin, appInsights };