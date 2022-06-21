export default class NotesAPI {
    static getAllNotes() {
        const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");
        return notes.sort((a, b) => {
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
        });
    }

    static getDeleteNotes() {
        const notes = JSON.parse(localStorage.getItem("notesapp-notes-delete") || "[]");
        return notes.sort((a, b) => {
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
        });
    }

    static getCompleteNotes() {
        const notes = JSON.parse(localStorage.getItem("notesapp-notes-complete") || "[]");
        return notes.sort((a, b) => {
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
        });
    }

    static saveNote(noteToSave) {
        const notes = NotesAPI.getAllNotes();
        const existing = notes.find(note => note.id == noteToSave.id);

        // Edit/Update
        if (existing) {
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.updated = new Date().toISOString();
        } else {
            noteToSave.id = Math.floor(Math.random() * 1000000);
            noteToSave.updated = new Date().toISOString();
            notes.push(noteToSave);
        }

        localStorage.setItem("notesapp-notes", JSON.stringify(notes));
    }

    static saveDeleteNote(noteToSave) {
        const notes = NotesAPI.getDeleteNotes();
        notes.push(noteToSave);
        localStorage.setItem("notesapp-notes-delete",JSON.stringify(notes));
    }
  
    static saveCompleteNote(noteToSave) {
        const notes = NotesAPI.getCompleteNotes();
        notes.push(noteToSave);
        localStorage.setItem("notesapp-notes-complete",JSON.stringify(notes));
    }

    static deleteNote(id) {
        const notes = NotesAPI.getAllNotes();
        const newNotes = notes.filter(note => note.id != id);
        const deleteNotes = notes.filter(note => note.id == id);
        localStorage.setItem("notesapp-notes",JSON.stringify(newNotes));
        NotesAPI.saveDeleteNote(deleteNotes);
    }

    static ClearNote(type) {
        const notes = [];
        switch(type){
            case "deleted":
                localStorage.setItem("notesapp-notes-delete",JSON.stringify(notes));
                break;
            case "completed":
                localStorage.setItem("notesapp-notes-complete",JSON.stringify(notes));
                break;
        }
    }

    static CompleteNote(note) {
        const id = note.id;
        const notes = NotesAPI.getAllNotes();
        const newNotes = notes.filter(note => note.id == id);
        const oldNotes = notes.filter(note => note.id != id);
        localStorage.setItem("notesapp-notes",JSON.stringify(oldNotes));
        NotesAPI.saveCompleteNote(newNotes);
    }
}
