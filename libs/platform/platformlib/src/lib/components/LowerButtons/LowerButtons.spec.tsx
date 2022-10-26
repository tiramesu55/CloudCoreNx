import { render } from '@testing-library/react';

import LowerButtons from './LowerButtons';

describe('LowerButtons', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LowerButtons />);
    expect(baseElement).toBeTruthy();
  });
});
