/**
Updated notes for development (Node 18):

- Vite runs directly; no custom wrapper is used.
- Dev script:
  npm run dev -- --port 3000 --host 0.0.0.0
- Dependencies pinned to Node 18 compatible versions:
  - vite: 5.4.11 (devDependency)
  - @vitejs/plugin-react: 4.2.1 (devDependency)
- Ensure you reinstall after lock cleanup:
  rm -rf node_modules package-lock.json
  npm install

Linting:
- Vendored/backup directories are ignored via eslint.config.local.js and .eslintrc.cjs ignorePatterns to avoid CI linting node_modules backups.
*/
