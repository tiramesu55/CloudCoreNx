import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory, BrowserHistoryOptions } from 'history';
// import service from "./service/service";

const instrumentationKey = "8f2e56e0-9ec2-491d-80bb-42f37ada0f5f"

let appInsights: ApplicationInsights | null = null;
const browserHistory = createBrowserHistory({ basename: '' } as BrowserHistoryOptions);
const reactPlugin = new ReactPlugin();
const appInsightsFunc = async () => { 
  // const config = await service.GetConfig();
  appInsights  = new ApplicationInsights({
      config: {
          instrumentationKey: instrumentationKey,
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