import { useEffect, useRef, useState } from 'react';
import Button from './Button.jsx';
import '../components/AddNoteModal.css';
import './ViewNoteModal.css';

/**
 * The parent mounts this only while a note is being viewed, and
 * remounts it (via a key) whenever the note changes, so state can
 * safely be initialised straight from props.
 */
export default function ViewNoteModal({ note, onClose, onSave, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [titleError, setTitleError] = useState('');
  const titleInputRef = useRef(null);

  // Focus the title field when entering edit mode — a DOM side
  // effect, not a state update, so it's a safe use of useEffect.
  useEffect(() => {
    if (isEditing) {
      titleInputRef.current?.focus();
    }
  }, [isEditing]);

  function handleStartEdit() {
    setTitle(note.title);
    setContent(note.content);
    setTitleError('');
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setTitle(note.title);
    setContent(note.content);
    setTitleError('');
    setIsEditing(false);
  }

  function handleSaveEdit(event) {
    event.preventDefault();

    if (!title.trim()) {
      setTitleError('The title cannot be empty.');
      return;
    }

    onSave(note.id, { title, content });
    setIsEditing(false);
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <article
        className="modal-card note-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="note-card-margin" aria-hidden="true"></div>

        {isEditing ? (
          <form className="modal-form" onSubmit={handleSaveEdit} noValidate>
            <label className="field-label" htmlFor="edit-title-input">
              Title <span className="required-mark">*</span>
            </label>
            <input
              id="edit-title-input"
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (titleError) setTitleError('');
              }}
              aria-required="true"
              aria-invalid={Boolean(titleError)}
            />
            {titleError && (
              <p className="field-error" role="alert">
                {titleError}
              </p>
            )}

            <label className="field-label" htmlFor="edit-content-input">
              Content <span className="optional-mark">(optional)</span>
            </label>
            <textarea
              id="edit-content-input"
              rows="7"
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />

            <div className="modal-actions">
              <Button variant="secondary" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <>
            <header className="note-card-header">
              <h2 id="card-title">{note.title}</h2>
              <Button
                variant="icon"
                id="edit-note-btn"
                onClick={handleStartEdit}
                aria-label="Edit note"
                title="Edit note"
              >
                ✎ Edit
              </Button>
            </header>

            <div id="card-body" className="note-card-body">
              {note.content ? (
                note.content.split('\n').map((paragraph, index) =>
                  paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />,
                )
              ) : (
                <p className="note-card-empty">No content added yet — click Edit to add some.</p>
              )}
            </div>

            <footer className="note-card-footer">
              <span
                id="card-status"
                className={`btn btn-status is-static tone-${note.completed ? 'complete' : 'incomplete'}`}
              >
                <span className="status-dot" aria-hidden="true"></span>
                {note.completed ? 'Completed' : 'Incomplete'}
              </span>

              <div className="note-card-footer-actions">
                <Button variant="danger" onClick={() => onDelete(note.id)}>
                  Delete
                </Button>
                <Button variant="secondary" id="close-card-btn" onClick={onClose}>
                  Close
                </Button>
              </div>
            </footer>
          </>
        )}
      </article>
    </div>
  );
}
