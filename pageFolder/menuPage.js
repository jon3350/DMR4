const MenuPage = {
    factoryMenuPage() {
        this.menuPage.initialize();
        return this.menuPage;
    },
    
    menuPage: {
        domContainer: document.querySelector('#menuPage'), //store the pageContainer from the html
        initialize() {
            //set up traveling event listeners
            document.querySelector('#notesButton').addEventListener('click', () => pageManager.changePage(1));
            document.querySelector('#practiceButton').addEventListener('click', () => pageManager.changePage(2));
            document.querySelector('#gameButton').addEventListener('click', () => pageManager.changePage(3));
        },
        setUp() {}, //called when the page becomes active
        closeUp() {} //called when the page becomes inactive
    },


}
