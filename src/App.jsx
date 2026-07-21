import { useMemo, useState } from 'react';
import './App.css';
import { useNotes } from './hooks/useNotes.js';
import Navbar from './components/Navbar.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import FilterBar from './components/FilterBar.jsx';
import NotesList from './components/NotesList.jsx';
import AddNoteModal from './components/AddNoteModal.jsx';
import ViewNoteModal from './components/ViewNoteModal.jsx';
import StatusPrompt from './components/StatusPrompt.jsx';
import Button from './components/Button.jsx';

export default function App() {
  const {
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
    notes,
  } = useNotes();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pendingNote, setPendingNote] = useState(null); // { title, content } awaiting a status choice
  const [viewingNoteId, setViewingNoteId] = useState(null);

  const viewingNote = useMemo(
    () => notes.find((note) => note.id === viewingNoteId) || null,
    [notes, viewingNoteId],
  );

  function handleAddNoteClick() {
    setIsAddModalOpen(true);
  }

  function handleCancelAdd() {
    setIsAddModalOpen(false);
  }

  // Step 1 of add flow: title/content are captured, then we ask for
  // a status before the note actually joins the list.
  function handleSaveNewNote(title, content) {
    setPendingNote({ title, content });
    setIsAddModalOpen(false);
  }

  // Step 2 of add flow: the user chooses completed or incomplete.
  function handleChooseStatus(completed) {
    if (pendingNote) {
      addNote(pendingNote.title, pendingNote.content, completed);
    }
    setPendingNote(null);
  }

  function handleView(id) {
    setViewingNoteId(id);
  }

  function handleCloseView() {
    setViewingNoteId(null);
  }

  function handleDeleteFromView(id) {
    deleteNote(id);
    setViewingNoteId(null);
  }

  function handleSaveEdit(id, updates) {
    editNote(id, updates);
  }

  return (
    <div className="app">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddNoteClick={handleAddNoteClick}
      />

      <main className="app-main">
        <div className="app-intro">
          <h2>Keep track of what needs to be done and what&apos;s already done.</h2>
        </div>

        {error && (
          <div className="app-error-banner" role="alert">
            <span>{error}</span>
            <Button
              variant="danger"
              className="app-error-dismiss"
              onClick={() => setError('')}
              aria-label="Dismiss"
            >
              ×
            </Button>
          </div>
        )}

        <StatsPanel total={stats.total} completed={stats.completed} />

        <FilterBar
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          visibleCount={visibleNotes.length}
        />

        <NotesList
          notes={visibleNotes}
          searchQuery={searchQuery}
          onView={handleView}
          onDelete={deleteNote}
          onToggleComplete={toggleComplete}
        />
      </main>

      <footer className="app-footer">Notes are saved in this browser only.</footer>

      {isAddModalOpen && (
        <AddNoteModal onCancel={handleCancelAdd} onSave={handleSaveNewNote} />
      )}

      {pendingNote && (
        <StatusPrompt noteTitle={pendingNote.title} onChoose={handleChooseStatus} />
      )}

      {viewingNote && (
        <ViewNoteModal
          key={viewingNote.id}
          note={viewingNote}
          onClose={handleCloseView}
          onSave={handleSaveEdit}
          onDelete={handleDeleteFromView}
        />
      )}
    </div>
  );
}
