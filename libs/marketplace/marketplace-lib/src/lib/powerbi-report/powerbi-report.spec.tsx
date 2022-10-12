import { render } from '@testing-library/react';

import PowerbiReport from './powerbi-report';

describe('PowerbiReport', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PowerbiReport />);
    expect(baseElement).toBeTruthy();
  });
});
