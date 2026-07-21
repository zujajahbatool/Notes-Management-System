import { useEffect, useMemo, useState } from 'react';
import { loadNotes, saveNotes } from '../utils/storage.js';

/**
 * useNotes centralises all note state and the operations the brief
 * asks for: addNote, deleteNote, toggleComplete, filterNotes and
 * updateStats. Notes live in a plain JS array (React state) and the
 * UI always re-renders from that state; nothing is mutated in place.
 */
export function useNotes() {
  const [notes, setNotes] = useState(() => loadNotes());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'completed' | 'incomplete'
  const [error, setError] = useState('');

  // Persist to localStorage every time the notes array changes. This
  // is a genuine "sync with an external system" effect; reporting a
  // write failure back into UI state is the intended follow-up.
  useEffect(() => {
    const ok = saveNotes(notes);
    if (!ok) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reporting an external-system (localStorage) failure, not a render-cascade
      setError('Your notes could not be saved to this browser. Storage may be full or disabled.');
    }
  }, [notes]);

  function addNote(title, content, completed) {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('A note needs a title before it can be saved.');
      return null;
    }

    const newNote = {
      id: Date.now() + Math.random().toString(16).slice(2),
      title: trimmedTitle,
      content: content.trim(),
      completed: Boolean(completed),
      createdAt: Date.now(),
    };

    setNotes((prevNotes) => [...prevNotes, newNote]);
    setError('');
    return newNote;
  }

  function deleteNote(id) {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  }

  function toggleComplete(id) {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, completed: !note.completed } : note,
      ),
    );
  }

  function editNote(id, updates) {
    const nextTitle = updates.title !== undefined ? updates.title.trim() : undefined;

    if (nextTitle !== undefined && !nextTitle) {
      setError('The title cannot be empty.');
      return false;
    }

    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id !== id) return note;
        return {
          ...note,
          ...(nextTitle !== undefined ? { title: nextTitle } : {}),
          ...(updates.content !== undefined ? { content: updates.content.trim() } : {}),
        };
      }),
    );
    setError('');
    return true;
  }

  /**
   * filterNotes applies the live search + status filter, then sorts
   * so incomplete notes always appear first (ties broken by newest
   * first). The component layer renders whatever this returns.
   */
  function filterNotes() {
    const query = searchQuery.trim().toLowerCase();

    return notes
      .filter((note) => note.title.toLowerCase().includes(query))
      .filter((note) => {
        if (statusFilter === 'completed') return note.completed;
        if (statusFilter === 'incomplete') return !note.completed;
        return true;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return b.createdAt - a.createdAt;
      });
  }

  /** updateStats derives the counts the status panel displays. */
  function updateStats() {
    return {
      total: notes.length,
      completed: notes.filter((note) => note.completed).length,
    };
  }

  // filterNotes/updateStats close over notes, searchQuery and
  // statusFilter, so those are the real dependencies of this memo.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const visibleNotes = useMemo(() => filterNotes(), [notes, searchQuery, statusFilter]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stats = useMemo(() => updateStats(), [notes]);

  return {
    notes,
    visibleNotes,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    error,
    setError,
    addNote,
    deleteNote,
    toggleComplete,
    editNote,
    filterNotes,
    updateStats,
  };
}
