import { render } from '@testing-library/react';

import ImportFile from './ImportFile';

describe('ImportFile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ImportFile />);
    expect(baseElement).toBeTruthy();
  });
});
