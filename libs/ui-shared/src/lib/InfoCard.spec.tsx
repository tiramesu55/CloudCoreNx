import { render } from '@testing-library/react';

import { InfoCard } from './InfoCard';

describe('InfoCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <InfoCard title={''} count={0} image={''} />
    );
    expect(baseElement).toBeTruthy();
  });
});
