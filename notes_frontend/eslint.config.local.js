//
// Local ESLint overrides for CI to ignore vendored and backup directories.
//
// PUBLIC_INTERFACE
/** This configuration prevents lint from scanning backup or vendor folders that can contain embedded ESLint disable comments and unknown rules. */
export default [
  {
    ignores: [
      'node_modules/**',
      'node_modules.bak_*/**',
      'dist/**',
      'public/**',
      // scripts may contain non-module Node launchers not meant for app linting
      'scripts/**',
    ],
  },
];
