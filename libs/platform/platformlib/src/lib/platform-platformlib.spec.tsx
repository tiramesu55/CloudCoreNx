import { render } from '@testing-library/react';

import PlatformPlatformlib from './platform-platformlib';

describe('PlatformPlatformlib', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PlatformPlatformlib />);
    expect(baseElement).toBeTruthy();
  });
});
