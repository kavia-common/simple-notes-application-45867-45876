/**
 * Bridge config for tools expecting .eslintrc format.
 * Only used to ensure ignores are respected in CI environments that don't load flat config.
 */
module.exports = {
  ignorePatterns: [
    'node_modules/**',
    'node_modules.bak_*/**',
    'dist/**',
    'public/**',
    'scripts/**',
  ],
};
