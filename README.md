# NOTES — Notes Management System

A React + Vite refactor of the original vanilla-JS Notes Management System, rebuilt as a proper React app while keeping the required vanilla-JS logic style (plain arrays for state, named handler functions, event delegation, `localStorage` persistence).

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build (outputs to dist/)
npm run lint     # run ESLint
```

## Features (per the brief)

- **Add a note** — navbar "＋ Add Note" opens a modal card. Title is required, content is optional. "Save Changes" / "Cancel" sit under the content field, and pressing Enter in the title field submits the form.
- **Status prompt** — right after a note is saved, a small dialog asks whether it's *Completed* or *Incomplete* before it's added to the list.
- **View all notes** — a list showing each note's short ID, title, status, a "View note" button and a "Delete" button. Clicking the status badge toggles complete/incomplete directly from the list.
- **View note modal** — shows the full title and content with proper formatting, with an "Edit" button beside the title. Editing lets you change the title (never allowed to be empty) and content.
- **Status panel** — total notes and total completed notes, shown above the list.
- **Filter** — All / Incomplete / Completed, directly above the list.
- **Sorting** — incomplete notes always appear before completed ones.
- **Search** — live search by title from the navbar searchbar.
- **Persistence** — all notes are stored in `localStorage` and reloaded on refresh.

## Implementation notes

- All UI state lives in a plain JS array (`notes`) inside the `useNotes` hook, and the UI always re-renders from that state — nothing is mutated in place.
- **Every button in the app is the same `src/components/Button.jsx` component** (`variant` picks the look: `primary`, `secondary`, `danger`, `ghost`, `icon`, `link`, `pill`, `status`; `tone`/`active` handle color and selected state). Its styles live in one place, `Button.css`, so no button style is written twice — each feature component only adds the small layout tweaks it needs (sizing, spacing) on top of it.
- `addNote`, `deleteNote`, `toggleComplete`, `filterNotes` and `updateStats` are implemented as explicit named functions in `src/hooks/useNotes.js`, matching the brief's function list. `renderNotes` lives in `src/components/NotesList.jsx` and turns the filtered/sorted array into row elements (React's `createElement`/JSX — never `innerHTML`).
- Delete and status-toggle actions in the notes list use **event delegation**: a single `onClick` handler on the list container reads `data-action`/`data-id` from the click target, rather than one listener per button — this still works cleanly through the shared `Button` component since it renders a real `<button>` and forwards `data-*`/`aria-*` props.
- Errors (empty title, `localStorage` write failures) are handled and surfaced in the UI instead of failing silently.
- Styling is plain, hand-written CSS (no Tailwind/UI kit), organised per component, with a responsive layout down to small phone widths.

## Project structure

```
src/
  components/
    Button.jsx / Button.css   # single reusable button, every variant used in the app
    StatsCard.jsx / StatsCard.css # single reusable stats card component both the total number of notes and total number of completed notes card use it
    Navbar, StatsPanel, FilterBar, NotesList, AddNoteModal, ViewNoteModal, StatusPrompt
  hooks/
    useNotes.js # state + addNote/deleteNote/toggleComplete/editNote/filterNotes/updateStats
  utils/
    storage.js  # localStorage read/write with error handling
  App.jsx
  App.css
  main.jsx
  index.css     # design tokens + global styles
```
