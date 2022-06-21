import NotesView from "./NotesView.js";
import NotesAPI from "./NotesAPI.js";

export default class App {
    constructor(root) {
        this.notes = [];
        this.activeNote = null;
        this.view = new NotesView(root, this._handlers());

        this._refreshNotes();
    }

    _refreshNotes() {
        const notes = NotesAPI.getAllNotes();
        const deleted = NotesAPI.getDeleteNotes();
        const completed = NotesAPI.getCompleteNotes();

        this._setNotes(notes, deleted, completed);

        if (notes.length > 0) {
            this._setActiveNote(notes[0]);
        }
    }

    _setNotes(notes, deleted, completed) {
        this.notes = notes;
        this.deleted = deleted;
        this.completed = completed;
        this.view.updateNoteList(notes, deleted, completed);
        this.view.updateNotePreviewVisibility(notes.length > 0);
    }

    _setActiveNote(note) {
        this.activeNote = note;
        this.view.updateActiveNote(note);
    }

    _handlers() {
        return {
            onNoteSelect: noteId => {
                const selectedNote = this.notes.find(note => note.id == noteId);
                this._setActiveNote(selectedNote);
            },
            onNoteAdd: () => {
                const newNote = {
                    title: "New Note",
                    body: "Take note..."
                };

                NotesAPI.saveNote(newNote);
                this._refreshNotes();
            },
            onNoteEdit: (title, body) => {
                NotesAPI.saveNote({
                    id: this.activeNote.id,
                    title,
                    body
                });

                this._refreshNotes();
            },
            onNoteDelete: noteId => {
                NotesAPI.deleteNote(noteId);
                this._refreshNotes();
            },
            onNoteClear: (type) => {
                NotesAPI.ClearNote(type);
                this._refreshNotes();
            },
            onNoteComplete: (note) => {
                NotesAPI.CompleteNote(note);
                this._refreshNotes();
            },
        };
    }
}
