/* eslint-disable */
export default {
  displayName: 'ui-shared',
  preset: '../../jest.preset.js',
  moduleNameMapper: {
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "identity-obj-proxy",
    '@cloudcore/redux-store': "<rootDir>/mocks/reduxMock.js" ,
    '@cloudcore/okta-and-config': "<rootDir>/mocks/contextMock.js" 
  },
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest'
  },
  verbose: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/ui-shared',
  bail: true
};
