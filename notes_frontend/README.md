/**
Updated notes for development:

- Dependencies are pinned to Node 18 compatible versions:
  - vite: 5.4.11 (devDependency)
  - @vitejs/plugin-react: 4.2.1 (devDependency)
- Run:
  npm install
  npm run dev -- --port 3000 --host 0.0.0.0

Linting:
- Vendored/backup directories are ignored via eslint.config.local.js and .eslintrc.cjs ignorePatterns to avoid CI linting node_modules backups.

*/
