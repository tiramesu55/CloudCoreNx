import { render } from '@testing-library/react';

import { CustomMultiSelectBox } from './custom-multi-select-box';
import { Option } from '../../components/select-sites/select-sites';

describe('CustomMultiSelectBox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <CustomMultiSelectBox
        application={''}
        inputList={[]}
        totalList={[]}
        customSelectLabel={''}
        handleChange={function (
          app: string,
          ent: string,
          updatedList: Option[]
        ): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
