import { useClaimsAndSignout } from '@cloudcore/okta-and-config';
import styles from './analytics-powerbi.module.css';
import {Header} from '@cloudcore/ui-shared'
/* eslint-disable-next-line */
export interface AnalyticsPowerbiProps {}

export function AnalyticsPowerbi(props: AnalyticsPowerbiProps) {
  //we will need to send 
  //the hook arguyments (below) needs toi be passed from a component
  const {signOut, getClaims } = useClaimsAndSignout( "https://apim-nexiacc-dev-eastus2-a5efee35.azure-api.net/powerbi-node-dev/SSOLogout","https://ssotest.walgreens.com/idp/idpLogout");
  return (
    <>
      <Header signOut={signOut} title = "Analytics" />
      <div className={styles['container']}>
        <h1>Welcome to AnalyticsPowerbi!</h1>
      </div>
    </>
  );
}

export default AnalyticsPowerbi;
