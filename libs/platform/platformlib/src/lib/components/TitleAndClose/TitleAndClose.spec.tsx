import { render } from '@testing-library/react';

import TitleAndClose from './TitleAndClose';

describe('TitleAndClose', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TitleAndClose />);
    expect(baseElement).toBeTruthy();
  });
});
