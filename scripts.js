let notes = JSON.parse(localStorage.getItem('notes')) || []
let searchQuery = '';

//navbar elements
const searchInput = document.getElementById('search-input');
const openAddModalButton = document.getElementById('open-add-modal-btn');

//stats and table elements
const totalItems = document.getElementById('total-items');
const completedItems = document.getElementById('completed-items');
const notesList = document.getElementById('notes-list');

//add note modal elements
const addNoteDialog = document.getElementById('add-note-dialog');
const addNoteForm = document.getElementById('add-note-form');
const noteTitleInput = document.getElementById('note-title-input');
const noteContentInput = document.getElementById('note-content-input');
const cancelModificationButton = document.getElementById('cancel-modification-btn');
const saveChangesButton = document.getElementById('save-changes-btn');

//notes card modal elements
const noteCardDialog = document.getElementById('note-card-dialog');
const cardTitle = document.getElementById('card-title');
const closeCardButton = document.getElementById('close-card-btn');
const cardContent = document.getElementById('card-content');
const cardStatus = document.getElementById('card-status');

//save state function
function saveState(){
  localStorage.setItem('notes', JSON.stringify(notes));
}

//add notes function
function addNote(){
  const title = noteTitleInput.value.trim();
  const content = noteContentInput.value.trim();

  if(!title) return;

  const newNote = {
    id: Date.now(),
    title: title,
    content: content || "no content provided",
    completed: false
  };

  notes.push(newNote);
  saveState();

  //resetting form inputs and closing the modal after notes are added
  noteTitleInput.value = '';
  noteContentInput.value = '';
  addNoteDialog.close();

  renderNotes();
}

//delete notes function
function deleteNote(id){
  notes = notes.filter(note=> note.id !== id);

  saveState();
  renderNotes();
}

//toggle complete notes function
function toggleComplete(id){
  notes = notes.map(note=> {
    if(note.id === id){
      return {...note, completed: !note.completed};
    }
    return note;
  });

  saveState();
  renderNotes();
}

//edit notes function
function editNotes(id){
  const note = notes.find(n => n.id === id);
  if(!note) return;

  const newTitle = prompt("Edit the title of the note: ", note.title);
  if(newTitle === null) return;

  const trimmedTitle = newTitle.trim();
  if(!trimmedTitle){
    alert("Title cannot be empty");
    return;
  }

  const newContent = prompt("Edit the content of the note: ", note.content);
  note.title = trimmedTitle;
  if(newContent !== null){
    note.content = newContent.trim();
  }

  saveState();
  renderNotes();
}

//filter and sort notes function
function filterNotes() {
  let filtered = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return filtered.sort((a, b) => Number(a.completed) - Number(b.completed));
}

//updating stats function
function updateStats() {
  totalItems.textContent = notes.length;
  const completedCount = notes.filter(n => n.completed).length;
  completedItems.textContent = completedCount;
}

//rendering notes function
function renderNotes() {
  while (notesList.firstChild) {
    notesList.removeChild(notesList.firstChild);
  }

  const visibleNotes = filterNotes();

  if (visibleNotes.length === 0) {
    const emptyRow = document.createElement('tr');
    const emptyTd = document.createElement('td');
    emptyTd.setAttribute('colspan', '4');
    emptyTd.style.textAlign = 'center';
    emptyTd.textContent = searchQuery ? 'No notes match your search.' : 'No notes added yet.';
    emptyRow.appendChild(emptyTd);
    notesList.appendChild(emptyRow);
    updateStats();
    return;
  }

  visibleNotes.forEach((note, index) => {
    const tr = document.createElement('tr');
    tr.dataset.id = note.id;
    if (note.completed) tr.classList.add('completed-row');

    //c1 sr no.
    const tdIndex = document.createElement('td');
    tdIndex.textContent = index + 1;

    //c2 title
    const tdTitle = document.createElement('td');
    tdTitle.textContent = note.title;
    tdTitle.classList.add('note-title-cell');

    //c3 status
    const tdStatus = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = note.completed;
    checkbox.classList.add('btn-complete');
    tdStatus.appendChild(checkbox);

    //c4 actions to modify and delete
    const tdActions = document.createElement('td');
    
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('btn-edit');

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('btn-delete');

    tdActions.appendChild(editBtn);
    tdActions.appendChild(deleteBtn);

    tr.appendChild(tdIndex);
    tr.appendChild(tdStatus);
    tr.appendChild(tdTitle);
    tr.appendChild(tdActions);

    notesList.appendChild(tr);
  });

  updateStats();
}

//card details modal
function showNoteCard(note) {
  cardTitle.textContent = note.title;
  cardContent.textContent = note.content;
  cardStatus.textContent = note.completed ? 'Status: Completed' : 'Status: Incomplete';
  noteCardDialog.showModal();
}

//open add note modal from navbar
openAddModalButton.addEventListener('click', () => {
  addNoteDialog.showModal();
});

//close add note modal on clicking the cancel button
cancelModificationButton.addEventListener('click', () => {
  addNoteDialog.close();
});

//handle add note form submission by pressing Enter or clicking Save
addNoteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addNote();
});

//handling navbar search input bar
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  renderNotes();
});

//delete, complete, edit, row View in table body
notesList.addEventListener('click', (e) => {
  const target = e.target;
  const row = target.closest('tr');
  if (!row || !row.dataset.id) return;

  const noteId = Number(row.dataset.id);

  if (target.classList.contains('btn-delete')) {
    e.stopPropagation();
    deleteNote(noteId);
  } else if (target.classList.contains('btn-complete')) {
    e.stopPropagation();
    toggleComplete(noteId);
  } else if (target.classList.contains('btn-edit')) {
    e.stopPropagation();
    editNotes(noteId);
  } else {
    const selectedNote = notes.find(n => n.id === noteId);
    if (selectedNote) showNoteCard(selectedNote);
  }
});

closeCardButton.addEventListener('click', () => noteCardDialog.close());

renderNotes();