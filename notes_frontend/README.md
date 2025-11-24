# Ocean Notes (Tizen Web)

A single‑page notes application for Tizen web runtime with local persistence.

Features:
- Create, view, edit, and delete notes
- Autosave title and content
- Search by title (real‑time)
- Sorted by last edited (most recent first)
- LocalStorage persistence: { id, title, content, createdAt, updatedAt }
- Accessible keyboard navigation and high‑contrast focus states
- Ocean Professional theme

Run locally:
- npm ci
- npm run dev (uses a local vite@5 wrapper to ensure Node 18 compatibility)
- npm run preview (uses the same vite@5 wrapper; used by the CI preview)

Lockfiles and Node 18:
- This repo uses npm-shrinkwrap.json as the authoritative lockfile to pin Vite 5.x and @vitejs/plugin-react 4.x for Node 18.
- Do not create or commit package-lock.json. If package-lock.json exists and you see Vite resolving to 7.x, delete package-lock.json and run `npm ci` again.

Node compatibility:
- This project targets Node 18.20.x in CI. Vite is pinned to 5.x and @vitejs/plugin-react to 4.x.
- If you see an error like "crypto.hash is not a function" or a message stating Vite requires Node 20.19+, your install likely resolved vite 7.x. Fix by:
  1. rm -rf node_modules package-lock.json npm-shrinkwrap.json
  2. npm ci

Note: The project pins Vite to a Node 18–compatible version to support CI. If you upgrade Node to >= 20.19, you can also upgrade Vite to v7+.
CI note: The build script will skip production build automatically on Node < 20.19 to prevent Vite incompatibility errors. Preview/dev flows are unaffected. On CI with Node 18.x, build is intentionally a no-op to avoid Vite 7 invocation.

Keyboard shortcuts and navigation:
- TAB / SHIFT+TAB to move between search, add button, list, title, and content
- ENTER on a list item to open it
- Delete buttons are accessible via TAB on each note row or via the editor action
- Remote keys supported:
  - UP/DOWN move focus between primary areas (search ⇄ add button ⇄ list ⇄ editor)
  - BACK logs a message (no navigation stack)
  - ENTER triggers default action on focused element

Files:
- src/App.jsx: Main UI implementation
- src/index.css: Ocean Professional theme and layout styles
- src/storage.js: localStorage helpers
- src/utils.js: debounce, relative time formatting, title normalization
- config.xml: Minimal Tizen widget configuration

Dev notes:
- The layout is fixed to 1920×1080 for Tizen TV preview
- Avoids unsupported APIs; uses vanilla React and browser APIs only
- Minimal inline comments are included in the code for maintainability
