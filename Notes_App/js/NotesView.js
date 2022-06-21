export default class NotesView {
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete, onNoteClear, onNoteComplete } = {}) {
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;
        this.onNoteClear = onNoteClear;
        this.onNoteComplete = onNoteComplete;
        this.activateNote = null;
        this.root.innerHTML = `
            <div class="notes__sidebar">
                <button class="notes__add" type="button">Add Note</button>
                <h3>Processing
                    <button class="notes__complete"><i class="bi bi-check-all"></i></button>
                </h3>
                <div class="notes__list"></div>
                <h3>Completed
                    <button class="notes__clear2"><i class="bi bi-trash"></i></button>
                </h3>
                <div class="notes__list_complete"></div>
                <h3>Delete
                    <button class="notes__clear"><i class="bi bi-trash"></i></button>
                </h3>
                <div class="notes__list_delete"></div>
            </div>
            <div class="notes__preview">
                <input class="notes__title" type="text" placeholder="New Note...">
                <textarea class="notes__body">Take Note...</textarea>
            </div>
        `;

        const btnCompleteNote = this.root.querySelector(".notes__complete");
        const btnClearNote = this.root.querySelector(".notes__clear");
        const btnClearNote2 = this.root.querySelector(".notes__clear2");
        const btnAddNote = this.root.querySelector(".notes__add");
        const inpTitle = this.root.querySelector(".notes__title");
        const inpBody = this.root.querySelector(".notes__body");

        btnAddNote.addEventListener("click", () => {
            this.onNoteAdd();
        });

        btnClearNote.addEventListener("click", () => {
            this.onNoteClear("deleted");
        });    
        
        btnClearNote2.addEventListener("click", () => {
            this.onNoteClear("completed");
        });        

        btnCompleteNote.addEventListener("click", () => {
            this.onNoteComplete(this.activateNote);
        });                

        [inpTitle, inpBody].forEach(inputField => {
            inputField.addEventListener("blur", () => {
                const updatedTitle = inpTitle.value.trim();
                const updatedBody = inpBody.value.trim();

                this.onNoteEdit(updatedTitle, updatedBody);
            });
        });

        this.updateNotePreviewVisibility(false);
    }

    _createListItemHTML(id, title, body, updated) {
        const MAX_BODY_LENGTH = 60;

        return `
            <div class="notes__list-item" data-note-id="${id}">
                <div class="notes__small-title">${title}</div>
                <div class="notes__small-body">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>
                <div class="notes__small-updated">
                    ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>
            </div>
        `;
    }

    updateNoteList(notes, deleted, completed) {
        const notesListContainer = this.root.querySelector(".notes__list");
        const deletedContainer = this.root.querySelector(".notes__list_delete");
        const completedContainer = this.root.querySelector(".notes__list_complete");

        // Empty list
        notesListContainer.innerHTML = "";
        deletedContainer.innerHTML = "";
        completedContainer.innerHTML = "";
        
        for (const note of notes) {
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));

            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        for(var i=0;i<deleted.length;i++){
            for (const note of deleted[i]){
                const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));

                deletedContainer.insertAdjacentHTML("beforeend", html);
            }
        }
        
        for(var i=0;i<completed.length;i++){
            for (const note of completed[i]){
                const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));

                completedContainer.insertAdjacentHTML("beforeend", html);
            }
        }

        // Add select/delete events for each list item
        notesListContainer.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.addEventListener("click", () => {
                this.onNoteSelect(noteListItem.dataset.noteId);
            });

            noteListItem.addEventListener("dblclick", () => {
                const doDelete = confirm("Are you sure you want to delete this note?");

                if (doDelete) {
                    this.onNoteDelete(noteListItem.dataset.noteId);
                }
            });
        });

    }

    updateActiveNote(note) {
        if(note===undefined) return;
        this.root.querySelector(".notes__title").value = note.title;
        this.root.querySelector(".notes__body").value = note.body;

        this.root.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.classList.remove("notes__list-item--selected");
        });

        this.activateNote = note;
        this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item--selected");
    }

    updateNotePreviewVisibility(visible) {
        this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden";
    }
}
