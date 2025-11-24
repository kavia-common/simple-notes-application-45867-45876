import { useEffect, useMemo, useRef, useState } from 'react';
import { useTizenKeys } from './hooks/useTizenKeys';
import './App.css';
import './index.css';
import { storage } from './storage';
import { debounce, formatRelativeTime, safeTitle } from './utils';

/**
 * NotesApp: Single page notes app for Tizen web runtime.
 * - Left: list of notes (search + add, sorted by updatedAt desc)
 * - Right: editor for selected note (title + content, autosave)
 * - Local persistence using localStorage
 * Accessibility: keyboard focus, aria labels, adequate contrast, focus ring.
 */
function App() {
  // Notes state
  const [notes, setNotes] = useState(() => storage.getAll());
  const [selectedId, setSelectedId] = useState(() => storage.getLastOpenedId() || (notes[0]?.id ?? null));
  const [query, setQuery] = useState('');
  const searchRef = useRef(null);
  const addBtnRef = useRef(null);
  const titleRef = useRef(null);
  const listRef = useRef(null);

  // Derive selected note
  const selectedNote = useMemo(() => notes.find(n => n.id === selectedId) || null, [notes, selectedId]);

  // Keep list sorted by updatedAt desc
  const sortedNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? notes.filter(n => (n.title || '').toLowerCase().includes(q)) : notes;
    return [...filtered].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, query]);

  // Persist last opened note id
  useEffect(() => {
    if (selectedId) storage.setLastOpenedId(selectedId);
  }, [selectedId]);

  // Debounced autosave for title/content updates
  const saveNoteDebounced = useMemo(
    () =>
      debounce((partial) => {
        if (!selectedNote) return;
        const updated = storage.update(selectedNote.id, partial);
        setNotes(prev => prev.map(n => (n.id === updated.id ? updated : n)));
      }, 300),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedNote?.id]
  );

  // Tizen keys handling: simple focus shortcuts
  useTizenKeys({
    onBack: () => {
      // No navigation stack, show a console log only
      console.log('Back pressed');
    },
    onUp: () => {
      // Move focus to search or list
      if (document.activeElement === titleRef.current) {
        listRef.current?.focus();
      } else if (document.activeElement === addBtnRef.current) {
        searchRef.current?.focus();
      }
    },
    onDown: () => {
      // Move focus down among controls
      if (document.activeElement === searchRef.current) {
        addBtnRef.current?.focus();
      } else if (document.activeElement === listRef.current) {
        titleRef.current?.focus();
      }
    },
  });

  function handleAddNote() {
    const created = storage.create({ title: 'Untitled', content: '' });
    setNotes(prev => [created, ...prev]);
    setSelectedId(created.id);
    // focus title after creating
    setTimeout(() => titleRef.current?.focus(), 0);
  }

  function handleDeleteNote(id) {
    const toDelete = notes.find(n => n.id === id);
    if (!toDelete) return;
    // Confirmation
    const ok = window.confirm('Delete this note? This action cannot be undone.');
    if (!ok) return;
    storage.remove(id);
    setNotes(prev => prev.filter(n => n.id !== id));
    if (id === selectedId) {
      // choose next sensible selection
      const remaining = notes.filter(n => n.id !== id);
      setSelectedId(remaining[0]?.id || null);
    }
  }

  function handleTitleChange(e) {
    const title = e.target.value;
    saveNoteDebounced({ title });
    // update local to reflect immediate typing
    if (selectedNote) {
      setNotes(prev => prev.map(n => (n.id === selectedNote.id ? { ...n, title } : n)));
    }
  }

  function handleContentChange(e) {
    const content = e.target.value;
    saveNoteDebounced({ content });
    if (selectedNote) {
      setNotes(prev => prev.map(n => (n.id === selectedNote.id ? { ...n, content } : n)));
    }
  }

  return (
    <div className="notes-app">
      <header className="topbar" role="banner" aria-label="Top navigation">
        <div className="brand">
          <span className="logo" aria-hidden="true">🗒️</span>
          <h1 className="app-title">Ocean Notes</h1>
        </div>
        <div className="search">
          <label htmlFor="search" className="sr-only">Search notes</label>
          <input
            id="search"
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes by title..."
            aria-label="Search notes by title"
          />
        </div>
      </header>

      <main className="main" role="main">
        <section className="sidebar" aria-label="Notes list">
          <div className="sidebar-header">
            <button
              ref={addBtnRef}
              className="btn btn-primary"
              onClick={handleAddNote}
              aria-label="Add new note"
            >
              + Add note
            </button>
          </div>

          <ul
            className="notes-list"
            role="listbox"
            aria-label="Notes"
            tabIndex={0}
            ref={listRef}
          >
            {sortedNotes.length === 0 && (
              <li className="empty" aria-live="polite">No notes found. Create one to get started.</li>
            )}
            {sortedNotes.map((n) => {
              const isActive = n.id === selectedId;
              const title = safeTitle(n.title);
              return (
                <li
                  key={n.id}
                  role="option"
                  aria-selected={isActive}
                  className={`note-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedId(n.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.keyCode === 13) setSelectedId(n.id);
                  }}
                  tabIndex={0}
                >
                  <div className="title" title={title}>{title}</div>
                  <div className="meta" aria-label={`Last updated ${formatRelativeTime(n.updatedAt)}`}>
                    {formatRelativeTime(n.updatedAt)}
                  </div>
                  <button
                    className="btn btn-icon btn-danger"
                    aria-label={`Delete note ${title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(n.id);
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                    title="Delete note"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="editor" aria-label="Editor">
          {!selectedNote ? (
            <div className="empty-editor">
              <p>Select a note from the left or create a new one.</p>
            </div>
          ) : (
            <div className="editor-inner">
              <div className="editor-actions">
                <button
                  className="btn btn-danger"
                  aria-label="Delete current note"
                  onClick={() => handleDeleteNote(selectedNote.id)}
                >
                  Delete
                </button>
              </div>
              <label htmlFor="title" className="sr-only">Note title</label>
              <input
                id="title"
                ref={titleRef}
                className="title-input"
                type="text"
                value={selectedNote.title}
                onChange={handleTitleChange}
                placeholder="Note title"
                aria-label="Note title"
              />
              <label htmlFor="content" className="sr-only">Note content</label>
              <textarea
                id="content"
                className="content-input"
                value={selectedNote.content}
                onChange={handleContentChange}
                placeholder="Start typing your thoughts..."
                aria-label="Note content"
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
