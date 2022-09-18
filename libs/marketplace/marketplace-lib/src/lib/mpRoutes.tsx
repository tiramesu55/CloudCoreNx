
import { useState, useEffect } from "react";
import { Switch, Route, Link } from "react-router-dom";

import { useClaimsAndSignout } from '@cloudcore/okta-and-config';
import {HeaderLayout} from '@cloudcore/ui-shared'

import Component1 from "../components/component1/component1";
import Component2 from "../components/component2/component2";


export const MpRoutes = () => {

  const {signOut, getClaims } = useClaimsAndSignout( "https://apim-nexiacc-dev-eastus2-a5efee35.azure-api.net/powerbi-node-dev/SSOLogout","https://ssotest.walgreens.com/idp/idpLogout");

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

