import React, { useState, useEffect, useRef } from 'react';

function debounce(fn, ms) {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// PUBLIC_INTERFACE
/**
 * NoteEditor: Edit or create notes; debounce autosave logic.
 * @param {object} note - Note object; if undefined/null, it's a new note.
 * @param {function} onChange - Callback (id, {title, content}).
 * @param {function} onSave - Callback (draft) for new note.
 * @param {function} onDelete - Callback (id) for delete.
 * @param {boolean} isNew - This is a new note (to save).
 */
function NoteEditor({ note, onChange, onSave, onDelete, isNew }) {
  // If isNew or !note, local state for temporary draft
  const [draft, setDraft] = useState({ title: '', content: '' });
  const [touched, setTouched] = useState(false);
  const lastNoteId = useRef(note ? note.id : null);

  // When selection changes, update draft
  useEffect(() => {
    if (!note) {
      setDraft({ title: '', content: '' });
      setTouched(false);
    } else {
      setDraft({ title: note.title, content: note.content });
      setTouched(false);
    }
    lastNoteId.current = note ? note.id : null;
  }, [note]);

  // Debounced autosave when editing existing note
  const debouncedUpdate = useRef(
    debounce((id, data) => {
      if (id && !isNew && onChange) {
        onChange(id, data);
      }
    }, 650)
  ).current;

  useEffect(() => {
    if (note && !isNew && touched) {
      debouncedUpdate(note.id, draft);
    }
    // eslint-disable-next-line
  }, [draft, isNew, touched, note]);

  // Handle field changes
  const handleField = (name, value) => {
    setDraft(d => ({ ...d, [name]: value }));
    setTouched(true);
  };
  // Save new note
  const handleSave = (e) => {
    e.preventDefault();
    if (draft.title.trim() || draft.content.trim()) {
      onSave(draft);
      setDraft({ title: '', content: '' });
      setTouched(false);
    }
  };
  // Discard edits for new note
  const handleDiscard = (e) => {
    e.preventDefault();
    setDraft({ title: '', content: '' });
    setTouched(false);
  };

  if (!note && !isNew) {
    // no note selected
    return (
      <div className="editor-empty ocean-surface">
        <div>Select a note, or create a new one.</div>
      </div>
    );
  }

  return (
    <form
      className="note-editor ocean-surface editor-shadow"
      aria-label={isNew ? "Create new note" : "Edit note"}
      autoComplete="off"
      tabIndex={0}
      onSubmit={isNew ? handleSave : e => e.preventDefault()}
    >
      <label htmlFor="note-title" className="editor-label">
        Title
        <input
          id="note-title"
          type="text"
          className="editor-title ocean-input"
          value={draft.title}
          autoFocus
          onChange={e => handleField('title', e.target.value)}
          required={isNew}
          aria-required={isNew}
          aria-label="Note title"
        />
      </label>
      <label htmlFor="note-content" className="editor-label">
        Content
        <textarea
          id="note-content"
          className="editor-content ocean-input"
          value={draft.content}
          rows={12}
          onChange={e => handleField('content', e.target.value)}
          aria-label="Note content"
        />
      </label>
      <div className="editor-actions">
        {isNew ? (
          <>
            <button
              className="ocean-btn ocean-primary"
              type="submit"
              aria-label="Save note"
            >
              Save
            </button>
            <button
              className="ocean-btn ocean-secondary"
              type="button"
              onClick={handleDiscard}
              aria-label="Discard"
            >
              Discard
            </button>
          </>
        ) : (
          <>
            <button
              className="ocean-btn ocean-primary"
              type="submit"
              disabled
              aria-label="Saved"
              title="Autosaved"
            >
              Saved
            </button>
            <button
              className="ocean-btn ocean-danger"
              type="button"
              onClick={() => onDelete(note.id)}
              aria-label="Delete note"
            >
              Delete
            </button>
          </>
        )}
      </div>
      {!isNew && (
        <div className="editor-meta">
          <span>Last updated: {note.updatedAt ? new Date(note.updatedAt).toLocaleString([], {
            year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
          }) : '—'}</span>
        </div>
      )}
    </form>
  );
}

export default NoteEditor;
