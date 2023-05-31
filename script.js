//create the page manager
const pageContainer = document.querySelector('#pageContainer');
const pageArr = [MenuPage.factoryMenuPage(), NotesPage.factoryNotesPage(), PracticePage.factoryPracticePage(), GamePage.factoryGamePage()];
const pageManager = PageUtil.factoryPageManager3(pageContainer, pageArr, 0);
pageManager.hideAllPagesExceptActive();

pageManager.changePage(0);