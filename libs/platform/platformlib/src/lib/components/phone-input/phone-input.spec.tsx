import { render } from '@testing-library/react';

import { PhoneInput } from './phone-input';

describe('PhoneInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PhoneInput />);
    expect(baseElement).toBeTruthy();
  });
});
