import { render } from '@testing-library/react';

import Powerbi from './powerbi';

describe('Powerbi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Powerbi />);
    expect(baseElement).toBeTruthy();
  });
});
