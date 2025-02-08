module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "prettier"],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": "error",
    "no-console": "warn",
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-process-exit": "error",
    "no-throw-literal": "error",
    "no-var": "error",
    "prefer-const": "error",
  },
};
