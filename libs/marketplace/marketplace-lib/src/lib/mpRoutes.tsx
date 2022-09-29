
import {  useContext } from "react";
import { Switch, Route, Link } from "react-router-dom";

import { ConfigCtx, IConfig, useClaimsAndSignout } from '@cloudcore/okta-and-config';
import {Header} from '@cloudcore/ui-shared'
import { useHistory } from "react-router-dom";
import Component1 from "../components/component1/component1";
import Component2 from "../components/component2/component2";

import logo from './images/Nexia-Logo2.png';
import logOutIcon from './images/sign-out.svg';

export const MpRoutes = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const config: IConfig  = useContext(ConfigCtx)!;   // at this point config is not null (see app)
  const {signOut, getClaims } = useClaimsAndSignout( config.logoutSSO,config.postLogoutRedirectUri);
  const userInitials = "AB", userName="James Smith"
  const history = useHistory();
  return (
    <>
          <Header
            title={'MARKETPLACE'}
            logo={{ img: logo, path: '/' }}
            betaIcon={true}
            reportIssue={false}
            navLinkMenuList={[
              { label: 'Component1', route: '/component1' },
              
              // submenu
              {
                label: 'More Components',
                subMenuList: [
                  { label: 'Component2', onClick: () => history.push('/component2') },
                  { label: 'Go back', onClick: () => history.push('/') },

                ],
              },
            ]}
            userMenu={{
              userName: userName,
              userInitials: userInitials,
            }}
            userMenuList={[
              {
                icon: logOutIcon,
                label: 'Logout',
                onClick: signOut,
              },
            ]}
          />
           
          <Switch>   

                  <Route
                   
                    path="/component1"
                    component= {Component1  }
                  />
                  <Route
            
                    path="/component2"
                    component={Component2}
                  />
          </Switch>
          </>
       
      ) 

};

