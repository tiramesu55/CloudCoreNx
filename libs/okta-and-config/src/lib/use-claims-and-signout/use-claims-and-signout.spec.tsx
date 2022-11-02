import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import useClaimsAndSignout from './use-claims-and-signout';

describe('useClaimsAndSignout', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useClaimsAndSignout());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
