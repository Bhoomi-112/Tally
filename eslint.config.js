import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "off", // handled by environment globals
    },
    settings: {
      react: { version: "detect" },
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        Date: "readonly",
        Promise: "readonly",
        URL: "readonly",
        fetch: "readonly",
        Set: "readonly",
        Object: "readonly",
        Array: "readonly",
        Math: "readonly",
        RegExp: "readonly",
        Number: "readonly",
        Boolean: "readonly",
        String: "readonly",
        Error: "readonly",
        process: "readonly",
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
  {
    ignores: ["dist/", "node_modules/", "*.config.js", "src/test/"],
  },
];
