import { render } from '@testing-library/react';

import { SelectSites } from './select-sites';

describe('SelectSites', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <SelectSites
        orgCode={''}
        modifiedData={function (modifiedData: boolean): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
