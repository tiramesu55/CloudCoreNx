// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AnalyticsPowerbi } from '@cloudcore/analytics/powerbi';
import { ConfigCtx, IConfig, OktaCode } from '@cloudcore/okta-and-config';
import { useContext } from 'react';

function App() {
  const config: IConfig | null = useContext(ConfigCtx);
  if(!config){
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>
  }
  return (
     <OktaCode
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          oidc={config.oidcConfig!}
          router={AnalyticsPowerbi} />

  );
}

export default App;
