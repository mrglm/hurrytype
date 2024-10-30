import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

const baseConfig = {
  ignores: ["**/dist/**", "**/node_modules/**"],
  languageOptions: {
    parser: tsParser,
    sourceType: "module",
    ecmaVersion: "latest",
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
  plugins: {
    "@typescript-eslint": ts,
    prettier,
  },
  rules: {
    ...ts.configs.recommended.rules,
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-console": "off",
    ...prettier.configs.recommended.rules,
    ...prettierConfig.rules,
  },
};

const backendConfig = {
  ...baseConfig,
  files: ["backend/**/*.ts"],
  rules: {
    ...baseConfig.rules,
  },
};

const frontendConfig = {
  ...baseConfig,
  settings: { react: { version: "18.detect" } },
  files: ["frontend/**/*.{ts,tsx}"],
  plugins: {
    ...baseConfig.plugins,
    react: react,
    "react-hooks": reactHooks,
  },
  rules: {
    ...baseConfig.rules,
    ...react.configs.recommended.rules,
    ...reactHooks.configs.recommended.rules,
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
};

export default [backendConfig, frontendConfig];
