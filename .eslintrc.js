module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["plugin:prettier/recommended", "prettier", "eslint:recommended"],
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    project: "tsconfig.json",
  },
  env: {
    es6: true,
    node: true,
    jest: true
  },
  rules: {
    "no-var": "error",
    semi: "error",
    indent: 'off',
    "no-multi-spaces": "error",
    "space-in-parens": "error",
    "no-multiple-empty-lines": "error",
    "prefer-const": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error"
  },
};
