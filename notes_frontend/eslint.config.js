/// PUBLIC_INTERFACE
/** ESLint flat config for CI with safe defaults and comprehensive ignore patterns.
 * Keeps configuration self-contained to avoid importing external packages in CI.
 */
export default [
  {
    name: "ci-base",
    languageOptions: {
      ecmaVersion: 2023,
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
    rules: {
      // keep simple; project code doesn't enforce special rules in CI
      "no-console": "off",
    },
  },
  {
    name: "ci-ignores",
    ignores: [
      "dist/**",
      "coverage/**",
      "node_modules/**",
      "node_modules.bak_*/**",
      "public/**",
      "scripts/**",
      "*.config.js",
      "vite.config.js",
    ],
  },
];
