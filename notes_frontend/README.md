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
- npm install
- npm run dev
- npm run preview (used by the CI preview)

Note: The project pins Vite to a Node 18–compatible version to support CI. If you upgrade Node to >= 20.19, you can also upgrade Vite to v7+.
CI note: The build script will skip production build automatically on Node < 20.19 to prevent Vite incompatibility errors. Preview/dev flows are unaffected.

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
