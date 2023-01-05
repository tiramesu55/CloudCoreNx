import * as React from 'react';
import { useOktaAuth, OnAuthRequiredFunction } from './OktaContext';
import * as ReactRouterDom from 'react-router-dom';
import { toRelativeUrl, AuthSdkError } from '@okta/okta-auth-js';
import OktaError from './OktaError';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
//replace useMatch in route6 witn useroutemacth in route 5
let useMatch: any;
if ('useRouteMatch' in ReactRouterDom) {
  // trick static analyzer to avoid "'useRouteMatch' is not exported" error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useMatch = (ReactRouterDom as any)[
    'useRouteMatch' in ReactRouterDom ? 'useRouteMatch' : ''
  ];
} else {
  // throw when useMatch is triggered
  useMatch = () => {
    throw new AuthSdkError(
      'Unsupported: SecureRoute only works with react-router-dom v5 or any router library with compatible APIs. See examples under the "samples" folder for how to implement your own custom SecureRoute Component.'
    );
  };
}
interface Props extends ReactRouterDom.RouteProps {
  onAuthRequired: OnAuthRequiredFunction;
}

const SecureRoute: React.FC<Props> = ({
  //& React.HTMLAttributes<HTMLDivElement> - not needed as router props
  onAuthRequired,
  ...routeProps
}) => {
  const { oktaAuth, authState } = useOktaAuth();
  const match = useMatch(routeProps);
  const pendingLogin = React.useRef(false);
  const [handleLoginError, setHandleLoginError] = React.useState<Error | null>(
    null
  );
  const ErrorReporter = OktaError;

  React.useEffect(() => {
    const handleLogin = async () => {
      if (pendingLogin.current) {
        return;
      }

      pendingLogin.current = true;

      const originalUri = toRelativeUrl(
        window.location.href,
        window.location.origin
      );
      oktaAuth.setOriginalUri(originalUri);
      await onAuthRequired(oktaAuth);
    };

    // Only process logic if the route matches
    if (!match) {
      return;
    }

    if (!authState) {
      return;
    }

    if (authState.isAuthenticated) {
      pendingLogin.current = false;
      return;
    }

    // Start login if app has decided it is not logged in and there is no pending signin
    if (!authState.isAuthenticated) {
      handleLogin().catch((err) => {
        setHandleLoginError(err as Error);
      });
    }
  }, [authState, oktaAuth, match, onAuthRequired]);

  if (handleLoginError) {
    return <ErrorReporter error={handleLoginError} />;
  }

  if (!authState || !authState.isAuthenticated) {
    return null;
  }

  return <ReactRouterDom.Route {...routeProps} />;
};

export default SecureRoute;
