const NotesPage = {
    factoryNotesPage() {
        this.notesPage.initialize();
        return this.notesPage;
    },

    notesPage: {
        domContainer: document.querySelector('#notesPage'), //store the pageContainer from the html
        initialize() {
            document.querySelectorAll('#notesPage .menuButton').forEach(x => x.addEventListener('click', () => pageManager.changePage(0)));
        },
        setUp() {}, //called when the page becomes active
        closeUp() {} //called when the page becomes inactive
    },


}
