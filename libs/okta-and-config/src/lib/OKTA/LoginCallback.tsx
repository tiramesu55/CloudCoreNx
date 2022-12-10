
import * as React from 'react';
import { useOktaAuth, OnAuthResumeFunction } from './OktaContext';
import OktaError from './OktaError';

interface LoginCallbackProps {
  errorComponent?: React.ComponentType<{ error: Error }>;
  onAuthResume?: OnAuthResumeFunction;
  loadingElement?: React.ReactElement;
}

const LoginCallback: React.FC<LoginCallbackProps> = ({ errorComponent, loadingElement = null, onAuthResume }) => { 
  const { oktaAuth, authState } = useOktaAuth();
  const [callbackError, setCallbackError] = React.useState(null);

  const ErrorReporter = errorComponent || OktaError;
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore OKTA-464505: backward compatibility support for auth-js@5
    const isInteractionRequired = oktaAuth.idx.isInteractionRequired || oktaAuth.isInteractionRequired.bind(oktaAuth);
    if (onAuthResume && isInteractionRequired()) {
      onAuthResume();
      return;
    }
    oktaAuth.handleLoginRedirect().catch(e => {
      setCallbackError(e);
    });
  }, [oktaAuth, onAuthResume]);

  const authError = authState?.error;
  const displayError = callbackError || authError;
  if (displayError) { 
    return <ErrorReporter error={displayError}/>;
  }

  return loadingElement;
};

export default LoginCallback;
