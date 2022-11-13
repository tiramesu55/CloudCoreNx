/*
 * Copyright (c) 2020-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import * as React from 'react';
import { useOktaAuth, IOktaContext } from './OktaContext';

const withOktaAuth = <P extends IOktaContext>(
  ComponentToWrap: React.ComponentType<P>
): React.FC<Omit<P, keyof IOktaContext>> => { 
  const WrappedComponent = (props: Omit<P, keyof IOktaContext>) => { 
    const oktaAuthProps = useOktaAuth();
    return <ComponentToWrap {...oktaAuthProps as IOktaContext } {...props as P} />;
  };
  WrappedComponent.displayName = 'withOktaAuth_' + (ComponentToWrap.displayName || ComponentToWrap.name);
  return WrappedComponent;
};

export default withOktaAuth;
