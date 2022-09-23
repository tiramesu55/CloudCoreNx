
import {  useContext } from "react";
import { Switch, Route, Link } from "react-router-dom";

import { ConfigCtx, IConfig, useClaimsAndSignout } from '@cloudcore/okta-and-config';
import {HeaderLayout} from '@cloudcore/ui-shared'

import Component1 from "../components/component1/component1";
import Component2 from "../components/component2/component2";


export const MpRoutes = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const config: IConfig  = useContext(ConfigCtx)!;   // at this point config is not null (see app)
  const {signOut, getClaims } = useClaimsAndSignout( config.logoutSSO,config.postLogoutRedirectUri);
  console.log('marketplace');
  return (
    
          <HeaderLayout signOut={signOut} title="Marketplace">
           
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

          </HeaderLayout>  
      ) 

};

