import { render } from '@testing-library/react';

import InputSelectWithLabel from './InputSelectWithLabel';

describe('InputSelectWithLabel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InputSelectWithLabel />);
    expect(baseElement).toBeTruthy();
  });
});
