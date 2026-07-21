import Button from './Button.jsx';
import './NotesList.css';

/**
 * A single click handler on the list container (event delegation)
 * handles the delete and toggle-complete actions for every row,
 * instead of attaching a listener per button.
 */
export default function NotesList({ notes, searchQuery, onView, onDelete, onToggleComplete }) {
  function handleListClick(event) {
    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;

    const row = event.target.closest('[data-id]');
    if (!row) return;

    const id = row.dataset.id;
    const action = actionEl.dataset.action;

    if (action === 'delete') {
      onDelete(id);
    } else if (action === 'toggle-complete') {
      onToggleComplete(id);
    } else if (action === 'view') {
      onView(id);
    }
  }

  // renderNotes: turns the already-filtered/sorted notes array into
  // the row elements shown in the list.
  function renderNotes() {
    if (notes.length === 0) {
      return (
        <li className="notes-empty">
          {searchQuery ? 'No notes match your search.' : 'No notes yet. Add your first one above.'}
        </li>
      );
    }

    return notes.map((note) => (
      <li key={note.id} className="note-row" data-id={note.id}>
        <span className="note-cell note-cell-id">#{String(note.id).slice(-5)}</span>

        <Button
          variant="link"
          className="note-cell note-cell-title"
          data-action="view"
          title="View note"
        >
          {note.title}
        </Button>

        <Button
          variant="status"
          tone={note.completed ? 'complete' : 'incomplete'}
          className="note-status-badge"
          data-action="toggle-complete"
          aria-pressed={note.completed}
          title="Toggle status"
        >
          <span className="status-dot" aria-hidden="true"></span>
          {note.completed ? 'Completed' : 'Incomplete'}
        </Button>

        <span className="note-actions">
          <Button variant="ghost" data-action="view">
            View note
          </Button>
          <Button variant="danger" data-action="delete">
            Delete
          </Button>
        </span>
      </li>
    ));
  }

  return (
    <section className="notes-list-section" aria-label="All notes">
      <div className="notes-list-head" aria-hidden="true">
        <span>ID</span>
        <span>Title</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      <ul id="notes-list" className="notes-list" onClick={handleListClick}>
        {renderNotes()}
      </ul>
    </section>
  );
}
