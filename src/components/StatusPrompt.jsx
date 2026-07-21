import Button from './Button.jsx';
import '../components/AddNoteModal.css';
import './StatusPrompt.css';

export default function StatusPrompt({ noteTitle, onChoose }) {
  return (
    <div className="modal-overlay" role="presentation">
      <div
        className="modal-card status-prompt-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-prompt-heading"
      >
        <h2 id="status-prompt-heading">Note saved!</h2>
        <p className="status-prompt-text">
          &ldquo;{noteTitle}&rdquo; has been added. How should it be marked?
        </p>

        <div className="status-prompt-actions">
          <Button
            variant="status"
            tone="incomplete"
            className="status-choice"
            onClick={() => onChoose(false)}
          >
            <span className="status-dot" aria-hidden="true"></span>
            Incomplete
          </Button>
          <Button
            variant="status"
            tone="complete"
            className="status-choice"
            onClick={() => onChoose(true)}
          >
            <span className="status-dot" aria-hidden="true"></span>
            Completed
          </Button>
        </div>
      </div>
    </div>
  );
}
