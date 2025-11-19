import React, { useRef } from 'react';
import NoteItem from './NoteItem';

// PUBLIC_INTERFACE
/**
 * NotesList component
 * @param {Object[]} notes - Array of note objects.
 * @param {string|null} selectedId - Currently selected note's id.
 * @param {function} onSelect - Callback (id) when user selects a note.
 * @param {function} onDelete - Callback (id) for delete.
 * @param {function} onNew - Callback for create new note.
 * @param {function} onSearch - Callback (term) for updating search/filter.
 * @param {string} searchValue - Current filter/search string.
 * @param {boolean} collapse - Is panel collapsible.
 * @param {boolean} collapsed - Panel is collapsed.
 */
function NotesList({
  notes,
  selectedId,
  onSelect,
  onDelete,
  onNew,
  onSearch,
  searchValue,
  collapse,
  collapsed,
}) {
  const listRef = useRef();

  // Keyboard: up/down to navigate, Enter to select, Del to delete
  function handleKeyDown(e) {
    if (!notes.length) return;
    const idx = notes.findIndex(n => n.id === selectedId);
    if (e.key === 'ArrowDown') {
      const nextIdx = idx < notes.length - 1 ? idx + 1 : 0;
      onSelect(notes[nextIdx].id);
      e.preventDefault();
    }
    if (e.key === 'ArrowUp') {
      const prevIdx = idx > 0 ? idx - 1 : notes.length - 1;
      onSelect(notes[prevIdx].id);
      e.preventDefault();
    }
    if (e.key === 'Delete') {
      onDelete(selectedId);
      e.preventDefault();
    }
  }

  if (collapse && collapsed) return null;

  return (
    <aside className="notes-list ocean-surface notes-panel-shadow" tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="notes-list-toolbar">
        <input
          type="text"
          className="notes-search"
          placeholder="Search notes..."
          aria-label="Search notes"
          value={searchValue}
          onChange={e => onSearch(e.target.value)}
        />
        <button className="ocean-btn ocean-secondary" onClick={onNew} aria-label="Add new note">
          ＋
        </button>
      </div>
      <ul
        className="notes-ul"
        ref={listRef}
        aria-label="List of notes"
        role="listbox"
      >
        {notes.length === 0 && (
          <li className="notes-empty">No notes found.</li>
        )}
        {notes.map(note => (
          <NoteItem
            key={note.id}
            note={note}
            selected={note.id === selectedId}
            onClick={() => onSelect(note.id)}
            onDelete={() => onDelete(note.id)}
          />
        ))}
      </ul>
    </aside>
  );
}

export default NotesList;
