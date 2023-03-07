/* eslint-disable */
export default {
  displayName: 'redux-store',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/lib/__tests__/mocks/svgrMock.js',
    '@cloudcore/okta-and-config': "<rootDir>/src/lib/__tests__/mocks/contextMock.js" ,
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/redux-store',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
};
