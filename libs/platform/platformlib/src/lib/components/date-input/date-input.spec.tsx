import { render } from '@testing-library/react';

import { DateInput } from './date-input';

describe('DateInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DateInput label={''} value={new Date()} />);
    expect(baseElement).toBeTruthy();
  });
});
