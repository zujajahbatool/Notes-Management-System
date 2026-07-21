import { useEffect, useRef, useState } from 'react';
import Button from './Button.jsx';
import './AddNoteModal.css';

/*rendered by the parent only while it should be visible, so every mount starts from a clean slate — no effect-based state resets.
 */
export default function AddNoteModal({ onCancel, onSave }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [titleError, setTitleError] = useState('');
  const titleInputRef = useRef(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      setTitleError("A note needs a title before it can be saved!");
      return;
    }

    onSave(title, content);
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={onCancel}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-note-heading"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-spiral" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, index) => (
            <span key={index} className="spiral-hole"></span>
          ))}
        </div>

        <h2 id="add-note-heading">Add a new note</h2>

        <form id="add-note-form" className="modal-form" onSubmit={handleSubmit} noValidate>
          <label className="field-label" htmlFor="note-title-input">
            Title: <span className="required-mark">*</span>
          </label>
          <input
            id="note-title-input"
            ref={titleInputRef}
            type="text"
            placeholder="Enter the note's title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (titleError) setTitleError('');
            }}
            aria-required="true"
            aria-invalid={Boolean(titleError)}
            aria-describedby={titleError ? 'title-error' : undefined}
          />
          {titleError && (
            <p id="title-error" className="field-error" role="alert">
              {titleError}
            </p>
          )}

          <label className="field-label" htmlFor="note-content-input">
            Content: <span className="optional-mark">(optional)</span>
          </label>
          <textarea
            id="note-content-input"
            placeholder="Write the note's content here"
            rows="6"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />

          <div className="modal-actions">
            <Button variant="secondary" id="cancel-modification-btn" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" id="save-changes-btn">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
