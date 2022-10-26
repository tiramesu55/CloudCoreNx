import { render } from '@testing-library/react';

import { InputTextWithLabel } from './input-text-with-label';

describe('InputTextWithLabel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InputTextWithLabel fieldName={''} />);
    expect(baseElement).toBeTruthy();
  });
});
