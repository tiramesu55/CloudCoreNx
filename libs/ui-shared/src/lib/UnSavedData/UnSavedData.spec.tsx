import { render } from '@testing-library/react';

import { UnsavedData } from './un-saved-data';

describe('UnSavedData', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <UnsavedData
        open={false}
        handleLeave={function (open: boolean): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
