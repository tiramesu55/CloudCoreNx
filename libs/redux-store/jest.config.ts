/* eslint-disable */
export default {
  displayName: 'redux-store',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
    // '^.+\\.svg$': 'jest-svg-transformer'
  },
  moduleNameMapper: {
    // "^.+\\.svg$": "jest-svg-transformer",
     '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/lib/__tests__/mocks/svgrMock.js',
    // "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "identity-obj-proxy",
  //   // '@cloudcore/redux-store': "<rootDir>/src/index.ts" ,
    '@cloudcore/okta-and-config': "<rootDir>/src/lib/__tests__/mocks/contextMock.js" ,
  //   // '@cloudcore/analytics/powerbi': "<rootDir>/../analytics/powerbi/src/index.ts",
  //   // '@cloudcore/common-lib': "<rootDir>/../common-lib/src/index.ts",
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/redux-store',
  // diagnostics: {
  //   ignoreCodes: [151001],
  // },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
};
