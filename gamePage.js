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
        choices: Array.from(document.querySelectorAll('.choice')),
        progressBar: document.querySelector('#gamePage #progressBar div'),

        gameOverModal: document.querySelector('#gameOverModal'),
        wrongMCQDisplay: document.querySelector('#wrongMCQDisplay'),

        rulesModal: document.querySelector('#rulesModal'),
        rulesModalButton: document.querySelector('#rulesModal button'),

        initialize() {
            document.querySelector('#gamePage .menuButton').addEventListener('click', () => pageManager.changePage(0));
            gameOverModal.querySelector('.menu').addEventListener('click', () => pageManager.changePage(0));

            this.choices.forEach((x,i) => {
                x.addEventListener('click', () => this.answerChosen(i));
            });

            this.rulesModalButton.addEventListener('click', () => this.startGame());

            // resize hangman
            window.addEventListener('resize', () => this.resizeHangman());
        },
        setUp() {
            this.rulesModal.showModal();

            this.resizeHangman();

            this.hangmanBodyParts.forEach(x => x.classList.add('hide'));

            this.timer.time = 1*60*1000;

            this.tracker.lives = 6;
            this.tracker.score = 0;
            this.tracker.wrong = [];

            this.reDraw();
        },
        closeUp() {
            window.clearInterval(this.timer.interval);
            this.gameOverModal.close();
        },

        startGame() {
            this.rulesModal.close();
            this.timer.start();
            this.generateMcq();
        },

        resizeHangman() {
            const parent = document.querySelector('[data-hangmanParentDiv]');
            const smallest = Math.min(parent.clientWidth, parent.clientHeight);
            const root = document.querySelector(':root');
            root.style.setProperty('--unit', `${0.9*smallest/25}px`);
        },

        tracker: {
            mcq: null,
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
                GamePage.gamePage.timer.time -= delta * (5 + (GamePage.gamePage.tracker.score/1000) );
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

        answerChosen(answerChosen) {
            if (this.tracker.mcq.checkAnswer(answerChosen)) {
                this.tracker.score += 1000;

                // animation
                this.score.classList.remove('scoreIncreaseAnimation');
                // trigger a DOM reflow 
                void this.score.offsetWidth; 
                this.score.classList.add('scoreIncreaseAnimation');

                this.timer.time += 0.1 * this.timer.maxTime;
                if(this.timer.time >= this.timer.maxTime) {
                    this.timer.time = this.timer.maxTime;
                }
            } else {
                this.hangmanBodyParts[6-this.tracker.lives].classList.remove('hide');
                this.tracker.lives--;
                this.tracker.wrong.push(this.tracker.mcq);
            }
            this.reDraw();
            this.generateMcq();

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
                group.querySelector('[data-question]').append(x.mcqQuestion);
                group.querySelector('[data-explaination]').append(x.problem.explaination);
                this.wrongMCQDisplay.append(group);
            })
            
            MathUtil.typeset();
            this.gameOverModal.showModal();
        },

        generateMcq() {
            // const mcq = McqUtil.generateNthTermMCQ();
            // const mcq = McqUtil.generateGeometricMCQ();
            const mcq = McqUtil.generatePSeriesMCQ();
            this.tracker.mcq = mcq;
            this.choices.forEach((x,i) => {
                x.innerHTML = mcq.mcqChoices[i];
            });

            this.questionDisplay2.replaceChildren(mcq.mcqQuestion);

            MathUtil.typeset();

        }
    },


}