

import * as React from 'react';

const OktaError: React.FC<{ error: Error }> = ({ error }) => { 
  if(error.name && error.message) { 
    return <p>{error.name}: {error.message}</p>;
  }
  return <p>Error: {error.toString()}</p>;
};

export default OktaError;
