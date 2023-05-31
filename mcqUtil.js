//returns a mcqObj object that contains a problem from series Util but uses mcq inputs
//extension of seriesUtil

const McqUtil = {
    factorymcqObj() {
        return {
            problem: null, //problem from seriesUtil
            mcqQuestion: null, //html element, same as the problem question but change all input boxes to ____
            mcqChoices: [], //array of choices
            correctIndex: 0, //index of where the correct choice lies
            initialize4(problem, mcqQuestion, mcqChoices, correctIndex) {
                this.problem = problem;
                this.mcqQuestion = mcqQuestion;
                this.mcqChoices = mcqChoices;
                this.correctIndex = correctIndex;
            },
            checkAnswer(choiceClicked) { //index of mcqChoices
                return choiceClicked == this.correctIndex;
            },
            turnInputsIntoUnderlines() { //assumes that the current mcqQuestion is the exact same as the problem question
                Array.from(this.mcqQuestion.querySelectorAll('select')).forEach(x => {
                    x.replaceWith(document.querySelector('#tempUnderlineReplace').content.firstElementChild.cloneNode(true));
                });
                Array.from(this.mcqQuestion.querySelectorAll('[data-inputAndButtonsParent]')).forEach(x => {
                    x.replaceWith(document.querySelector('#tempUnderlineReplace').content.firstElementChild.cloneNode(true));
                });
            }
        };
    },

    generateNthTermMCQ() {
        const mcq = this.factorymcqObj();
        mcq.problem = SeriesUtil.generateNthProblem();
        mcq.mcqQuestion = mcq.problem.question;
        mcq.turnInputsIntoUnderlines();
        mcq.mcqChoices = ['1','2','3','4'];
        mcq.correctIndex = 0;

        return mcq;
    },

    generateGeometricMCQ() {
        const mcq = this.factorymcqObj();
        mcq.problem = SeriesUtil.generateGeometricProblem();
        mcq.mcqQuestion = mcq.problem.question;
        mcq.turnInputsIntoUnderlines();
        mcq.mcqChoices = ['1','2','3','4'];
        mcq.correctIndex = 0;

        return mcq;
    },

    generatePSeriesMCQ() {
        const mcq = this.factorymcqObj();
        mcq.problem = SeriesUtil.generatePSeriesProblem();
        mcq.mcqQuestion = mcq.problem.question;
        mcq.turnInputsIntoUnderlines();
        mcq.mcqChoices = ['1','2','3','4'];
        mcq.correctIndex = 0;

        return mcq;
    },
}

