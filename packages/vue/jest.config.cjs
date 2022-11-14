/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "ts", "json"],
  moduleNameMapper: {
    "\\.(vue)$": "<rootDir>/__mocks__/vue-module-mock.ts",
  },
};
