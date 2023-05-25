const GamePage = {
    factoryGamePage() {
        this.gamePage.initialize();
        return this.gamePage;
    },

    gamePage: {
        domContainer: document.querySelector('#gamePage'), //store the pageContainer from the html
        hangman: document.querySelector('#hangman'),
        timeLeft: document.querySelector('#timeLeft span'),
        score: document.querySelector('#score span'),
        highScore: document.querySelector('#highScore span'),
        questionDisplay2: document.querySelector('#questionDisplay2'),
        submitButton2: document.querySelector('#submitButton2'),

        initialize() {
            document.querySelector('#gamePage .menuButton').addEventListener('click', () => pageManager.changePage(0));

            this.submitButton2.addEventListener('click', () => this.submitButtonClicked());
        },
        setUp() {
            this.generateProblem();

            this.timer.time = 1*60*1000;
            this.timer.start();

            this.reDraw();
        },
        closeUp() {
            window.clearInterval(this.timer.interval);
        },

        tracker: {
            problem: null,
            questionNumber: '1',
            correctNumber: '0',
            lives: 3,
            score: 0,
            highScore: 0
        },

        timer: {
            prev: Date.now(),
            time: 1*60*1000,
            interval: null,
            start() {
                this.prev = Date.now();
                this.interval = window.setInterval(this.updateTime, 250);
            },
            stop() {
                window.clearInterval(this.interval);
            },
            updateTime() {
                GamePage.gamePage.timer.time -= Date.now() - GamePage.gamePage.timer.prev;
                GamePage.gamePage.timer.prev = Date.now();
                GamePage.gamePage.timeLeft.innerHTML = `${GamePage.gamePage.timer.time/1000}`;
            }
        },

        submitButtonClicked() {
            if (this.tracker.problem.checkAnswer()) {
                this.timer.time += 10*1000;
                this.tracker.score += 1000;
            } else {
                this.tracker.lives--;
            }
            this.reDraw();
            this.generateProblem();

            if(this.tracker.lives == 0 || this.timer.time <= 0) {
                alert("GAME OVER!");
                this.tracker.highScore = this.tracker.score;
                this.highScore.innerHTML = this.tracker.highScore;
            }
        },

        reDraw() {
            this.hangman.innerHTML = this.tracker.lives;
            this.score.innerHTML = this.tracker.score;
        },

        generateProblem() {
            let r = MathUtil.randomNumber(1, 9);
            while (r==6 || r==7 || r==8) {
                r = MathUtil.randomNumber(1, 9);
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
            } else if (r == 9) {
                this.tracker.problem = SeriesUtil.generateRatioTestExpression();
            }

            this.questionDisplay2.replaceChildren(this.tracker.problem.question);

            MathUtil.typeset();
        }
    },


}
