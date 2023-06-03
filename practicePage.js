const PracticePage = {
    factoryPracticePage() {
        this.practicePage.initialize();
        return this.practicePage;

    },

    practicePage: {
        checkboxes: Array.from(document.querySelectorAll('#practicePage input')),
        seriesDisplay: document.querySelector('#seriesDisplay'),
        submitButton: document.querySelector('#submitButton'),
        questionDisplay: document.querySelector('#questionDisplay'),
        questionNumberDiv: document.querySelector('#practicePage [data-questionNumberDiv] span'),
        answerModal: document.querySelector('#answerModal'),
        nextQuestionButton: document.querySelector('#practicePage [data-nextQuestionButton]'),
        newProblemButton: document.querySelector('#practicePage [data-newProblemButton]'),
        closeModalButton: document.querySelector('#closeModalButton'),
        modalMessage: document.querySelector('#modalMessage'),
        modalExplaination: document.querySelector('#modalExplaination'),
        htmlPracticePageModalCollapseTarget: document.querySelector('#htmlPracticePageModalCollapseTarget'),


        initialize() {
            document.querySelector('#practicePage .menuButton').addEventListener('click', () => pageManager.changePage(0));

            this.checkboxes.forEach(x => x.checked = true);
            this.submitButton.addEventListener('click', () => this.submitButtonClicked()); //must be wrapped as an anonomous function for some reason
            this.closeModalButton.addEventListener('click', () => this.closeModalButtonClicked());
            this.nextQuestionButton.addEventListener('click', () => this.generateProblem());
            this.newProblemButton.addEventListener('click', () => this.generateProblem());

            this.tracker.questionNumber = 0;

            this.generateProblem();
        },


        //inherited
        domContainer: document.querySelector('#practicePage'),

        //inherited
        setUp() {

        },

        //inherited
        closeUp() {

        },


        tracker: {
            problem: null,
            questionNumber: 0,
        },

        closeModalButtonClicked() {
            this.closeModalButton.setAttribute('disabled','');

            this.answerModal.close();
            this.answerModal.show();
        },


        submitButtonClicked() {
            this.submitButton.setAttribute('disabled','');

            if (this.tracker.problem.checkAnswer()) {
                this.modalMessage.innerText = 'Correct';
                this.answerModal.classList.remove('text-bg-danger');
                this.answerModal.classList.add('text-bg-success');
            } else {
                this.modalMessage.innerHTML = 'Incorrect';
                this.answerModal.classList.add('text-bg-danger');
                this.answerModal.classList.remove('text-bg-success');
            }
            this.modalExplaination.replaceChildren(this.tracker.problem.explaination);
            MathUtil.typeset();
            this.answerModal.showModal();
        },

        generateProblem() {
            if (!this.checkboxes.some(x => x.checked)) {
                alert('at least one valid thing must be checked');
                return;
            }

            this.submitButton.removeAttribute('disabled');
            this.closeModalButton.removeAttribute('disabled');
            this.answerModal.close();
            this.htmlPracticePageModalCollapseTarget.classList.remove('show');

            this.questionNumberDiv.innerHTML = ++this.tracker.questionNumber;

            let r = MathUtil.randomNumber(1, 11);
            while (!this.checkboxes[r - 1].checked) {
                r = MathUtil.randomNumber(1, 11);
            }

            if (r == 1) {
                this.tracker.problem = SeriesUtil.generateNthProblem();
            } else if (r == 2) {
                this.tracker.problem = SeriesUtil.generateGeometricProblem();
            } else if (r == 3) {
                this.tracker.problem = SeriesUtil.generateTelescopingProblem();
            } else if (r == 4) {
                this.tracker.problem = SeriesUtil.generateIntegralTestProblem();
            } else if (r == 5) {
                this.tracker.problem = SeriesUtil.generatePSeriesProblem();
            } else if (r == 6) {
                this.tracker.problem = SeriesUtil.generateDirectComparisonProblem();
            } else if (r == 7) {
                this.tracker.problem = SeriesUtil.generateLimitComparisonProblem();
            } else if (r == 8) {
                this.tracker.problem = SeriesUtil.generateASTProblem();
            } else if (r == 9) {
                this.tracker.problem = SeriesUtil.generateASTRemainderProblem();
            } else if (r == 10) {
                this.tracker.problem = SeriesUtil.generateRatioTestExpression();
            } else if (r == 11) {
                const n = MathUtil.randomNumber(1,3);
                if(n == 1) {
                    this.tracker.problem = SeriesUtil.generateSequenceProblem1();
                } else if(n == 2) {
                    this.tracker.problem = SeriesUtil.generateSequenceProblem2();
                } else if(n == 3) {
                    this.tracker.problem = SeriesUtil.generateSequenceProblem3();
                }
            }

            this.questionDisplay.replaceChildren(this.tracker.problem.question);

            MathUtil.typeset();
        },
    }
    
}