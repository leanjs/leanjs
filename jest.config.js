// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

process.env.TZ = "CET";

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    `<rootDir>/node_modules/`,
    "<rootDir>/examples/",
  ],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  modulePathIgnorePatterns: ["/dist/"],
};
