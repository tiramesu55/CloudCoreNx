import { render } from '@testing-library/react';

import UserOnboardingInstructions from './userOnboardingInstructions';

describe('UserOnboardingInstructions', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UserOnboardingInstructions />);
    expect(baseElement).toBeTruthy();
  });
});
