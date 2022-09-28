
import {  useContext } from "react";
import { Switch, Route, Link } from "react-router-dom";

import { ConfigCtx, IConfig, useClaimsAndSignout } from '@cloudcore/okta-and-config';
import {Header} from '@cloudcore/ui-shared'

import Component1 from "../components/component1/component1";
import Component2 from "../components/component2/component2";
import {MenuBar} from "../components/MenuBar";


export const MpRoutes = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const config: IConfig  = useContext(ConfigCtx)!;   // at this point config is not null (see app)
  const {signOut, getClaims } = useClaimsAndSignout( config.logoutSSO,config.postLogoutRedirectUri);

  return (
    <>
          <Header signOut={signOut} title="Marketplace" menu={<MenuBar/>}/>
           
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

