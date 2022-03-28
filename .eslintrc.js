module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    `eslint:recommended`,
    "plugin:@typescript-eslint/recommended",
    `plugin:react/recommended`,
    "plugin:import/warnings",
    "plugin:jest-dom/recommended",
    "plugin:testing-library/react",
    `prettier`,
  ],
  plugins: [
    "@typescript-eslint",
    "react-hooks",
    "simple-import-sort",
    "jest-dom",
    "testing-library",
    `prettier`,
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: `module`,
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  rules: {
    "no-unused-expressions": `off`,
    "@babel/no-invalid-this": `error`,
    "no-invalid-this": `off`,
    "new-cap": `off`,
    "no-unused-vars": [
      `warn`,
      {
        varsIgnorePattern: `^_`,
        argsIgnorePattern: `^_`,
        ignoreRestSiblings: true,
      },
    ],
    "consistent-return": [`error`],
    "prettier/prettier": `error`,
    "react/display-name": `off`,
    "react/jsx-key": `warn`,
    "react/no-unescaped-entities": `off`,
    "react/prop-types": `off`,
    "require-jsdoc": `off`,
    "valid-jsdoc": `off`,
    "prefer-promise-reject-errors": `warn`,
    "no-prototype-builtins": `warn`,
    "guard-for-in": `warn`,
    "spaced-comment": [
      `error`,
      `always`,
      { markers: [`/`], exceptions: [`*`, `+`] },
    ],
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx", ".js", ".jsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
    react: {
      version: `detect`,
    },
  },
};
