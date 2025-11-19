const LOCAL_KEY = 'notes_v1';

// PUBLIC_INTERFACE
/**
 * Reads environment variables to determine preferred API base URL.
 */
export function getBaseUrl() {
  // Reads REACT_APP_API_BASE, fallback REACT_APP_BACKEND_URL
  return process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || '';
}

/**
 * Returns the list of notes, sorted by updatedAt descending.
 */
async function list() {
  const raw = localStorage.getItem(LOCAL_KEY);
  const notes = raw ? JSON.parse(raw) : [];
  return notes.sort((a, b) => b.updatedAt - a.updatedAt);
}

/**
 * Gets a note by id.
 */
async function get(id) {
  const notes = await list();
  return notes.find(n => n.id === id) || null;
}

/**
 * Creates a new note and saves in localStorage.
 * Future: POST to `${getBaseUrl()}/notes`
 */
async function create({ title = '', content = '' }) {
  // TODO: If backend exists, POST to API and replace with API result.
  const id = Date.now().toString();
  const note = {
    id,
    title,
    content,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const notes = await list();
  const next = [note, ...notes];
  localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
  return note;
}

/**
 * Updates a note by id.
 * Future: PATCH/PUT to `${getBaseUrl()}/notes/:id`
 */
async function update(id, { title, content }) {
  // TODO: If backend exists, PATCH to API and replace with API result.
  const notes = await list();
  const idx = notes.findIndex(n => n.id === id);
  if (idx === -1) throw new Error('Note not found');
  notes[idx] = {
    ...notes[idx],
    title: typeof title !== 'undefined' ? title : notes[idx].title,
    content: typeof content !== 'undefined' ? content : notes[idx].content,
    updatedAt: Date.now(),
  };
  localStorage.setItem(LOCAL_KEY, JSON.stringify(notes));
  return notes[idx];
}

/**
 * Deletes a note by id.
 * Future: DELETE from `${getBaseUrl()}/notes/:id`
 */
async function _delete(id) {
  // TODO: If backend exists, DELETE from API.
  const notes = await list();
  const next = notes.filter(n => n.id !== id);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
  return true;
}

const notesApi = { list, get, create, update, delete: _delete, getBaseUrl };

export default notesApi;
