import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    ...nxE2EPreset(__dirname),
    "experimentalSessionAndOrigin": true,    
  },
});