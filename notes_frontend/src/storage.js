/**
 * storage: localStorage-based persistence for notes.
 * Schema: { id, title, content, createdAt, updatedAt }
 * Keys:
 *  - notes_v1: JSON array of notes
 *  - lastOpenedId_v1: string|null
 */
const NOTES_KEY = 'notes_v1';
const LAST_OPENED_KEY = 'lastOpenedId_v1';

// PUBLIC_INTERFACE
export const storage = {
  /** Get all notes from localStorage. */
  getAll() {
    try {
      const raw = localStorage.getItem(NOTES_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.map(normalize) : [];
    } catch {
      return [];
    }
  },

  /** Create a new note with defaults and persist it. */
  create({ title = 'Untitled', content = '' } = {}) {
    const now = Date.now();
    const note = { id: genId(), title, content, createdAt: now, updatedAt: now };
    const all = this.getAll();
    const next = [note, ...all];
    localStorage.setItem(NOTES_KEY, JSON.stringify(next));
    return note;
  },

  /** Update an existing note by id with partial fields. Returns updated note. */
  update(id, partial) {
    const all = this.getAll();
    const idx = all.findIndex(n => n.id === id);
    if (idx === -1) return null;
    const now = Date.now();
    const updated = normalize({ ...all[idx], ...partial, updatedAt: now });
    all[idx] = updated;
    localStorage.setItem(NOTES_KEY, JSON.stringify(all));
    return updated;
  },

  /** Remove a note by id. */
  remove(id) {
    const all = this.getAll();
    const next = all.filter(n => n.id !== id);
    localStorage.setItem(NOTES_KEY, JSON.stringify(next));
    const last = localStorage.getItem(LAST_OPENED_KEY);
    if (last === id) localStorage.removeItem(LAST_OPENED_KEY);
  },

  /** Save last opened note id. */
  setLastOpenedId(id) {
    try {
      localStorage.setItem(LAST_OPENED_KEY, id ?? '');
    } catch {}
  },

  /** Get last opened note id. */
  getLastOpenedId() {
    try {
      const v = localStorage.getItem(LAST_OPENED_KEY);
      return v || null;
    } catch {
      return null;
    }
  },
};

function genId() {
  // Simple UID compatible with Tizen without crypto requirements
  return 'n_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function normalize(n) {
  return {
    id: String(n.id),
    title: typeof n.title === 'string' ? n.title : 'Untitled',
    content: typeof n.content === 'string' ? n.content : '',
    createdAt: typeof n.createdAt === 'number' ? n.createdAt : Date.now(),
    updatedAt: typeof n.updatedAt === 'number' ? n.updatedAt : Date.now(),
  };
}
