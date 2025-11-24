#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * Vite 5 launcher wrapper.
 * This wrapper ensures we execute vite@5.x regardless of any workspace-level resolution to vite@7.
 * It requires the local alias package "vite5" (npm alias to vite@5.4.11) if installed,
 * otherwise falls back to the local project's vite if it is 5.x.
 *
 * Usage:
 *   node scripts/vite5.js [command] [args...]
 * Examples:
 *   node scripts/vite5.js --host 0.0.0.0 --port 3000
 *   node scripts/vite5.js build
 *   node scripts/vite5.js preview --host 0.0.0.0 --port 3000
 */
(async () => {
  function run(binPath, argv) {
    // Use Node to execute the vite binary file.
    require(binPath);
  }

  // Try vite5 alias first
  try {
    const vite5PkgJson = require('vite5/package.json');
    if (!/^5\./.test(vite5PkgJson.version)) {
      console.error(`ERROR: vite5 alias resolved to version ${vite5PkgJson.version}, expected 5.x`);
      process.exit(1);
    }
    const bin = require.resolve('vite5/bin/vite.js');
    run(bin, process.argv.slice(2));
    return;
  } catch (e) {
    // no-op, will try local vite
  }

  // Fallback: local vite if version is 5.x
  try {
    const vitePkgJson = require('vite/package.json');
    if (!/^5\./.test(vitePkgJson.version)) {
      console.error(`ERROR: Local vite resolved to version ${vitePkgJson.version}, but Node 18 requires vite 5.x`);
      console.error('Fix by removing node_modules and reinstalling from npm-shrinkwrap.json.');
      process.exit(1);
    }
    const bin = require.resolve('vite/bin/vite.js');
    run(bin, process.argv.slice(2));
  } catch (e) {
    console.error('ERROR: Unable to resolve vite. Ensure dependencies are installed.');
    console.error(e?.message || e);
    process.exit(1);
  }
})();
