import { render } from '@testing-library/react';

import OktaAndConfig from './okta-and-config';

describe('OktaAndConfig', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OktaAndConfig />);
    expect(baseElement).toBeTruthy();
  });
});
