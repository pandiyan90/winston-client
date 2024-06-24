// jest.config.js
export default {
    transform: {
      '^.+\\.mjs$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'mjs'],
    testMatch: ['**/__tests__/**/*.mjs', '**/?(*.)+(spec|test).mjs']
};
  