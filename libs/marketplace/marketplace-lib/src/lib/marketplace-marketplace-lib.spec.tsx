import { render } from '@testing-library/react';

import MarketplaceMarketplaceLib from './marketplace-marketplace-lib';

describe('MarketplaceMarketplaceLib', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MarketplaceMarketplaceLib />);
    expect(baseElement).toBeTruthy();
  });
});
