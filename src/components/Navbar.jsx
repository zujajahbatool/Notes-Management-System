import "./Navbar.css";
import Button from "./Button.jsx";

export default function Navbar({
  searchQuery,
  onSearchChange,
  onAddNoteClick,
}) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="nav-brand">
          <span className="nav-brand-mark" aria-hidden="true"></span>
          <h1>NOTES</h1>
        </div>

        <div className="nav-searchbar">
          <svg
            className="nav-search-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="16.5"
              y1="16.5"
              x2="21"
              y2="21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            id="search-input"
            placeholder="Search notes by title"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search notes by title"
          />
        </div>

        <div className="nav-btns">
          <Button
            type="button"
            id="open-add-modal-btn"
            variant="status"
            tone="complete"
            onClick={onAddNoteClick}
          >
            Add Note
          </Button>
        </div>
      </div>
    </header>
  );
}
