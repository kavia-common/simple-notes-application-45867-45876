/// PUBLIC_INTERFACE
/** Minimal ESLint flat config for CI that does not import external packages. */
export default [
  {
    name: "ci-base",
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        module: "readonly",
        require: "readonly",
        process: "readonly",
      },
    },
    rules: {},
  },
  {
    name: "ci-ignores",
    ignores: [
      "dist/**",
      "coverage/**",
      "node_modules/**",
      "scripts/**",
      "*.config.js",
      "vite.config.js",
    ],
  },
]; 
