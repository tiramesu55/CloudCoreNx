import { render } from '@testing-library/react';

import UserOnboardingForm from './userOnboardingForm';

describe('UserOnboardingForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UserOnboardingForm />);
    expect(baseElement).toBeTruthy();
  });
});
