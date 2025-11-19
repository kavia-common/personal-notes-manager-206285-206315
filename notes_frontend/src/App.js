import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import './index.css';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import notesApi from './api/notesApi';

// PUBLIC_INTERFACE
function App() {
  // Application state
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  // Responsive state for list collapse
  const [isMobile, setIsMobile] = useState(false);
  const collapseBtnRef = useRef();

  // Load from localStorage on mount
  useEffect(() => {
    notesApi.list().then(setNotes);
  }, []);

  // Window resize listener for responsive collapse
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Select note by id (default: first note if none selected)
  useEffect(() => {
    if ((selectedId === null || !notes.find(n => n.id === selectedId)) && notes.length > 0) {
      setSelectedId(notes[0].id);
    }
    if (notes.length === 0) {
      setSelectedId(null);
    }
  }, [notes, selectedId]);

  // Handlers for CRUD actions
  const handleSelect = useCallback((id) => {
    setSelectedId(id);
    if (isMobile && !collapsed) setCollapsed(true);
  }, [isMobile, collapsed]);
  // Create a new empty note and select it
  const handleNew = async () => {
    const newNote = await notesApi.create({ title: '', content: '' });
    setNotes(n => [newNote, ...n]);
    setSelectedId(newNote.id);
    if (isMobile) setCollapsed(true);
  };
  // Update an existing note by id
  const handleUpdate = async (id, changes) => {
    const next = await notesApi.update(id, changes);
    setNotes(notes =>
      notes.map(n => (n.id === id ? { ...n, ...next } : n)).sort((a, b) => b.updatedAt - a.updatedAt)
    );
  };
  // Delete with confirmation dialog
  const handleDelete = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (window.confirm('Delete this note? This cannot be undone.')) {
      await notesApi.delete(id);
      setNotes(notes => notes.filter(n => n.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
      }
    }
  };
  // Autosave from editor
  const handleAutosave = (id, data) => {
    handleUpdate(id, data);
  };
  // Save new note (for unsaved notes)
  const handleSave = async (draft) => {
    const saved = await notesApi.create(draft);
    setNotes(n => [saved, ...n]);
    setSelectedId(saved.id);
  };

  // Search/filter notes
  const filteredNotes = notes
    .filter(n => n.title.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => b.updatedAt - a.updatedAt);

  // The selected note object
  const activeNote = notes.find(n => n.id === selectedId);

  // Main render
  return (
    <div className="app-root ocean-theme">
      <div
        className="ocean-header"
        style={{
          background: "linear-gradient(90deg, rgba(59,130,246,0.1), #f9fafb)",
          boxShadow: "0 1px 8px rgba(59,99,235,0.06)",
        }}
      >
        <div className="header-title" tabIndex={0} aria-label="Personal Notes application">
          📝 Personal Notes
        </div>
        {isMobile &&
          <button
            className="toggle-list-btn"
            aria-label={`${collapsed ? 'Open' : 'Collapse'} notes list`}
            aria-controls="notes-panel"
            aria-expanded={!collapsed}
            onClick={() => setCollapsed(c => !c)}
            ref={collapseBtnRef}
          >
            {collapsed ? '☰ Notes' : '✕ Close'}
          </button>
        }
      </div>
      <div className="app-main" role="main">
        <nav
          className={`notes-list-panel${collapsed && isMobile ? ' collapsed' : ''}`}
          id="notes-panel"
          aria-label="Notes list"
          tabIndex={!collapsed && isMobile ? 0 : -1}
        >
          <NotesList
            notes={filteredNotes}
            selectedId={selectedId}
            onSelect={handleSelect}
            onDelete={handleDelete}
            onNew={handleNew}
            onSearch={setFilter}
            searchValue={filter}
            collapse={isMobile}
            collapsed={collapsed}
          />
        </nav>
        <section className="note-editor-panel" tabIndex={0}>
          <NoteEditor
            note={activeNote}
            onChange={handleAutosave}
            onSave={handleSave}
            onDelete={handleDelete}
            isNew={!activeNote}
          />
        </section>
      </div>
    </div>
  );
}

export default App;
