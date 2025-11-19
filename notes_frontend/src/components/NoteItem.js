import React from 'react';

// PUBLIC_INTERFACE
/**
 * NoteItem represents a single row (note) in the NotesList
 * @param {object} note - {id, title, updatedAt}
 * @param {boolean} selected
 * @param {function} onClick
 * @param {function} onDelete
 */
function NoteItem({ note, selected, onClick, onDelete }) {
  return (
    <li
      className={`note-item${selected ? ' note-selected' : ''}`}
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      role="option"
      onClick={onClick}
      onKeyPress={e => (e.key === 'Enter' ? onClick() : null)}
    >
      <div className="note-meta">
        <span className="note-title">{note.title || <i>(Untitled)</i>}</span>
        <span className="note-updated" aria-label="last updated">
          {new Date(note.updatedAt).toLocaleString([], {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
      <button
        className="note-delete-btn"
        aria-label="Delete note"
        tabIndex={0}
        onClick={e => {
          e.stopPropagation();
          onDelete();
        }}
        title="Delete"
      >
        🗑
      </button>
    </li>
  );
}

export default NoteItem;
