import React from 'react';

import { addDecorator } from '@storybook/react';
import { ThemeProvider } from '@mui/material';

import theme from '../src/lib/themes';

export default {
  parameters: { actions: { argTypesRegex: '^on.*' } },
};

addDecorator((story) => <ThemeProvider theme={theme}>{story()}</ThemeProvider>);
