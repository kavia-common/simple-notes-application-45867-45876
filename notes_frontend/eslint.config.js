/**
 * ESLint configuration resilient to missing optional dependencies during CI bootstrap.
 * Avoids importing from 'eslint/config' to prevent ERR_MODULE_NOT_FOUND if eslint
 * is not yet installed in CI. Falls back to minimal configuration.
 */
function safeRequire(id, fallback = null) {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(id)
  } catch {
    return fallback
  }
}

const globals = safeRequire('globals', { browser: {} })
const reactHooks = safeRequire('eslint-plugin-react-hooks', { configs: { 'recommended-latest': {} } })
const reactRefresh = safeRequire('eslint-plugin-react-refresh', { configs: { vite: {} } })

/**
 * PUBLIC_INTERFACE
 * Export ESLint flat-config array without importing from eslint/config.
 */
export default [
  // Ignore dist outputs
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      reactHooks?.configs?.['recommended-latest'] || {},
      reactRefresh?.configs?.vite || {},
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals?.browser || {},
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-undef': 'error',
      'no-const-assign': 'error',
      'no-dupe-keys': 'error',
      'no-dupe-args': 'error',
      'no-duplicate-case': 'error',
      'constructor-super': 'error',
    },
  },
]
