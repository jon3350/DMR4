const PageUtil = {
    //call factoryPageManager to generate a pageManager
    //supply the pageManager with an array of pages


    //stuff in the page folder has these methods but may not have called factoryPage
    factoryPage() {
        return {
            domContainer: null, //store the pageContainer from the html
            initialize() {}, //called upon creation
            setUp() {}, //called when the page becomes active
            closeUp() {} //called when the page becomes inactive

        }

    },
    
    factoryPageManager() {
        return {
            domContainer: null, //store the pageContainer from the html
            pageArr: [], //store the page objects
            activePageIndex: 0,
            initialize3(domContainer, pageArr, activePageIndex) {
                this.domContainer = domContainer;
                this.pageArr = pageArr;
                this.activePageIndex = activePageIndex;
            },
            hideAllPagesExceptActive() {
                this.pageArr.forEach((x,i) => {
                    if(i != this.activePageIndex) {
                        x.domContainer.classList.add('hide');
                    }
                })
            },
            changePage(index) {
                this.pageArr[this.activePageIndex].domContainer.classList.add('hide');
                this.pageArr[this.activePageIndex].closeUp();
                this.activePageIndex = index;
                this.pageArr[this.activePageIndex].domContainer.classList.remove('hide');
                this.pageArr[this.activePageIndex].setUp();
            }
        }
    },

    factoryPageManager3(domContainer, pageArr, activePage) {
        const newPageManager = this.factoryPageManager();
        newPageManager.initialize3(domContainer, pageArr, activePage);
        return newPageManager;
    }    
}