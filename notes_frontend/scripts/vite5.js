#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * Vite 5 launcher wrapper.
 * Ensures the project runs with vite@5.x by invoking a local alias dependency "vite5": "npm:vite@5.4.11".
 * If the alias is not installed, it will try the local 'vite' package only if it is 5.x.
 *
 * Usage:
 *   node scripts/vite5.js [command] [args...]
 * Examples:
 *   node scripts/vite5.js --host 0.0.0.0 --port 3000
 *   node scripts/vite5.js build
 *   node scripts/vite5.js preview --host 0.0.0.0 --port 3000
 */
(async () => {
  function run(binPath) {
    // Delegate to vite's CLI entry (CommonJS)
    if (typeof require !== "function") {
      console.error("ERROR: CommonJS require is not available in this runtime. Ensure Node is used to run this script.");
      process.exit(1);
    }
    require(binPath);
  }

  // 1) Try vite5 alias (preferred and enforced)
  try {
    const vite5PkgJson = require('vite5/package.json');
    if (!/^5\./.test(vite5PkgJson.version)) {
      console.error(`ERROR: vite5 alias resolved to version ${vite5PkgJson.version}, expected 5.x`);
      process.exit(1);
    }
    const bin = require.resolve('vite5/bin/vite.js');
    run(bin);
    return;
  } catch (e) {
    // alias not available, continue to fallback
  }

  // 2) Fallback to local vite only if it is 5.x
  try {
    const vitePkgJson = require('vite/package.json');
    if (!/^5\./.test(vitePkgJson.version)) {
      console.warn(`Warning: Local vite resolved to ${vitePkgJson.version}.`);
      console.warn('This project requires vite 5.x under Node 18. Please ensure dependency alias is set:');
      console.warn('  "vite5": "npm:vite@5.4.11"');
      console.warn('Then reinstall dependencies and try again.');
      process.exit(1);
    }
    const bin = require.resolve('vite/bin/vite.js');
    run(bin);
    return;
  } catch (e) {
    console.error('ERROR: Unable to resolve vite5 alias or local vite. Ensure dependencies are installed.');
    console.error(e?.message || e);
    process.exit(1);
  }
})();
