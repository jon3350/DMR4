const GamePage = {
    factoryGamePage() {
        this.gamePage.initialize();
        return this.gamePage;
    },

    gamePage: {
        domContainer: document.querySelector('#gamePage'), //store the pageContainer from the html
        hangmanBodyParts: Array.from(document.querySelector('#hangmanBodyParts').children),
        score: document.querySelector('#score span'),
        highScore: document.querySelector('#highScore span'),
        questionDisplay2: document.querySelector('#questionDisplay2'),
        submitButton2: document.querySelector('#submitButton2'),
        progressBar: document.querySelector('#gamePage #progressBar div'),

        gameOverModal: document.querySelector('#gameOverModal'),
        wrongMCQDisplay: document.querySelector('#wrongMCQDisplay'),

        rulesModal: document.querySelector('#rulesModal'),
        rulesModalButton: document.querySelector('#rulesModal button'),

        modalScoreDisplay: document.querySelector('#gameOverModal [data-modalScoreDisplay]'),

        initialize() {
            document.querySelector('#gamePage .menuButton').addEventListener('click', () => pageManager.changePage(0));
            gameOverModal.querySelector('.menu').addEventListener('click', () => pageManager.changePage(0));

            this.submitButton2.addEventListener('click', () => this.submitButtonClicked()); //must be wrapped as an anonomous function for some reason

            this.rulesModalButton.addEventListener('click', () => this.startGame());

            // resize hangman
            window.addEventListener('resize', () => this.resizeHangman());
        },
        setUp() {
            this.rulesModal.showModal();

            this.hangmanBodyParts.forEach(x => x.classList.add('hide'));

            this.timer.time = 1*60*1000;

            this.tracker.lives = 6;
            this.tracker.score = 0;
            this.tracker.wrong = [];

            this.reDraw();

            this.resizeHangman();
        },
        closeUp() {
            window.clearInterval(this.timer.interval);
            this.gameOverModal.close();
        },

        startGame() {
            this.rulesModal.close();
            this.timer.start();
            this.generateProblem();

            this.resizeHangman();
        },

        resizeHangman() {
            const parent = document.querySelector('[data-hangmanParentDiv]');
            const smallest = Math.min(parent.clientWidth, parent.clientHeight);
            const root = document.querySelector(':root');
            root.style.setProperty('--unit', `${0.9*smallest/25}px`);
        },

        tracker: {
            problem: null,
            questionNumber: '1',
            correctNumber: '0',
            lives: 6,
            score: 0,
            highScore: 0,
            wrong: [], //array for mcq problems answered incorrectly
        },

        timer: {
            prev: Date.now(),
            time: 1*60*1000,
            maxTime: 1*60*1000,  //the max time for the timer
            interval: null,
            start() {
                this.prev = Date.now();
                this.interval = window.setInterval(this.updateTime, 100);
            },
            stop() {
                window.clearInterval(this.interval);
            },
            updateTime() {
                const delta = Date.now() - GamePage.gamePage.timer.prev;
                GamePage.gamePage.timer.time -= delta * (2);
                GamePage.gamePage.timer.prev = Date.now();

                // health bar
                const percent = Math.round(100 * GamePage.gamePage.timer.time/(GamePage.gamePage.timer.maxTime));
                GamePage.gamePage.progressBar.style.width = `${percent}%`;
                if(percent >= 50) {
                    GamePage.gamePage.progressBar.classList.add('bg-success');
                    GamePage.gamePage.progressBar.classList.remove('bg-warning');
                    GamePage.gamePage.progressBar.classList.remove('bg-danger');
                } else if(percent >= 20) {
                    GamePage.gamePage.progressBar.classList.remove('bg-success');
                    GamePage.gamePage.progressBar.classList.add('bg-warning');
                    GamePage.gamePage.progressBar.classList.remove('bg-danger');
                } else {
                    GamePage.gamePage.progressBar.classList.remove('bg-success');
                    GamePage.gamePage.progressBar.classList.remove('bg-warning');
                    GamePage.gamePage.progressBar.classList.add('bg-danger');
                }

                if(GamePage.gamePage.timer.time <= 0) {
                    GamePage.gamePage.hangmanBodyParts[6-GamePage.gamePage.tracker.lives].classList.remove('hide');
                    GamePage.gamePage.tracker.lives--;
                    GamePage.gamePage.timer.time = GamePage.gamePage.timer.maxTime;

                    if(GamePage.gamePage.tracker.lives == 0) {
                        GamePage.gamePage.gameOver();
                    }
                }
            }
        },

        submitButtonClicked() {
            if (this.tracker.problem.checkAnswer()) {
                this.tracker.score += 1000;

                // animation
                this.score.classList.remove('scoreIncreaseAnimation');
                // trigger a DOM reflow 
                void this.score.offsetWidth; 
                this.score.classList.add('scoreIncreaseAnimation');

                this.timer.time += (0.1 + 0.9/(this.tracker.score/1000)) * this.timer.maxTime;
                if(this.timer.time >= this.timer.maxTime) {
                    this.timer.time = this.timer.maxTime;
                }
            } else {
                this.hangmanBodyParts[6-this.tracker.lives].classList.remove('hide');
                this.tracker.lives--;
                this.tracker.wrong.push(this.tracker.problem);
            }
            this.reDraw();
            this.generateProblem();

            if(this.tracker.lives == 0 || this.timer.time <= 0) {
                this.gameOver();
                this.tracker.highScore = this.tracker.score;
                this.highScore.innerHTML = this.tracker.highScore;
            }
        },

        reDraw() {
            this.score.innerHTML = this.tracker.score;
        },

        gameOver() {
            this.tracker.highScore = this.tracker.score;
            this.timer.stop();
            this.wrongMCQDisplay.replaceChildren();
            this.tracker.wrong.forEach(x => {
                console.log(x);
                const group = document.querySelector('#tempGameOverModal').content.firstElementChild.cloneNode(true);
                group.querySelector('[data-question]').append(x.question);
                group.querySelector('[data-explaination]').append(x.explaination);
                this.wrongMCQDisplay.append(group);
            });

            
            MathUtil.typeset();
            this.modalScoreDisplay.innerText = this.tracker.score;
            this.gameOverModal.showModal();
        },

        generateProblem() {
            let r = MathUtil.randomNumber(1, 11);

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
            this.questionDisplay2.replaceChildren(this.tracker.problem.question);

            MathUtil.typeset();

        }
    },


}