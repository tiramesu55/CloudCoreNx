import { render } from '@testing-library/react';

import AnalyticsPowerbi from './analytics-powerbi';

describe('AnalyticsPowerbi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AnalyticsPowerbi />);
    expect(baseElement).toBeTruthy();
  });
});
