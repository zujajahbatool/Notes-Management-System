const STORAGE_KEY = 'Notes-Management-System.notes';

/**
 * Reads the saved notes array from localStorage.
 * Returns an empty array if nothing is stored, or if the stored
 * value is missing/corrupted, so the app never crashes on load.
 */
export function loadNotes() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch (error) {
    console.error('Could not read notes from localStorage:', error);
    return [];
  }
}

/**
 * Persists the notes array to localStorage.
 * Failures (private browsing, quota exceeded, etc.) are caught so a
 * storage problem never breaks the UI.
 */
export function saveNotes(notes) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch (error) {
    console.error('Could not save notes to localStorage:', error);
    return false;
  }
}
