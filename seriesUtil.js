//used to return a problem object containing a questions the answers and the input DOM elements
//contains methods to check the answer as well


//infinity symbol ∞
//-infinity symbol −∞

SeriesUtil = {
	infSymbol: '∞',
	negInfSymbol: '−∞',
	dneSymbol: '∄',
	autoCorrect: 'correct!',

	factoryProblem() {
		return {
			series: 'latex',
			question: 'html element',
			inputs: [], //elements to check
			answers: [], //string answers
			diffuculty: 1,
			explaination: null, //html element
			initialize5(series, question, inputs, answers, diffuculty) {
				this.series = series;
				this.question = question;
				this.inputs = inputs;
				this.answers = answers;
				this.diffuculty = diffuculty;
			},
			checkAnswer() { //this method can be overwritten if need be customized, '' => true/don't need answer
				const inputsRef = this.inputs; //this is weird so need this ref
				return this.answers.every((x, i) => {
					if (x == SeriesUtil.autoCorrect) {
						return true;
					}
					if (x == SeriesUtil.infSymbol || x == SeriesUtil.negInfSymbol || x == SeriesUtil.dneSymbol) {
						return x == inputsRef[i].value;
					}
					return SeriesUtil.testEquals(inputsRef[i].value, x);
				});
			}
		}
	},

	//test if the input is within three decimal places of answer; gives a +-0.002 margin of error
	testEquals(input, answer) {
		input = Math.floor(eval(input) * 1000) / 1000;
		answer = eval(answer);

		return Math.abs(input - answer) <= 0.002;
	},

	//call this to attach infty to number input
	linkButtonsToInput(input, buttonArr) {
		buttonArr.forEach(x => {
			x.addEventListener('click', () => {
				// input.value = x.innerText;
				input.setAttribute('type', 'text');
				input.value = x.innerText;
			})
		})
		input.addEventListener('focus', () => {
			input.setAttribute('type', 'number');
		})
	},

	generateNthProblem() {
		let converges = Math.random() < 0.5;  //converge means inconclusive in this case

		const terms = MathUtil.randomNumber(1, 4);
		const highPower = MathUtil.randomNumber(1, 9);
		const lowPower = MathUtil.randomNumber(0, highPower);
		const a = MathUtil.generatePolynomial2(terms, highPower);
		const b = MathUtil.generatePolynomial2(terms, lowPower);

		let fractionLatex;
		if (highPower == lowPower || !converges) {
			fractionLatex = `\\frac{${a.toLatex()}}{${b.toLatex()}}`;
		} else if (converges) {
			fractionLatex = `\\frac{${b.toLatex()}}{${a.toLatex()}}`;
		} else {
			console.error('mistake');
		}


		const problem = SeriesUtil.factoryProblem();

		//set the explaination and answers
		const explaination = document.createElement('div');
		if (highPower == lowPower) {
			const newFraction = MathUtil.factoryFraction();
			newFraction.initialize3(Math.abs(a.constants[0]), Math.abs(b.constants[0]), Math.sign(a.constants[0]) == Math.sign(b.constants[0]));
			newFraction.reduceFraction();
			explaination.innerText = `\\( \\lim\\limits_{n \\to \\infty } \\left( ${fractionLatex} \\right) = ${newFraction.toLatexStandAlone()} \\neq 0 \\therefore \\) the series diverges`;

			problem.answers = ['2', newFraction.toDecimal()];
		} else if (converges) {
			explaination.innerText = `\\( \\lim\\limits_{n\\to \\infty } \\left( ${fractionLatex} \\right) = 0 \\therefore \\) the nth term test fails`;

			problem.answers = ['3', 0];
		} else {
			let plusMinusInfinity;
			if (Math.sign(a.constants[0]) == Math.sign(b.constants[0])) {
				plusMinusInfinity = SeriesUtil.infSymbol;
			} else {
				plusMinusInfinity = SeriesUtil.negInfSymbol;
			}
			explaination.innerText = `\\( \\lim\\limits_{n\\to \\infty } \\left( ${fractionLatex} \\right) = ${plusMinusInfinity} \\neq 0 \\therefore \\) the series diverges`;

			problem.answers = ['2', plusMinusInfinity];
		}
		problem.explaination = explaination;

		problem.series = `\\sum_{1}^{\\infty} ${fractionLatex}`;

		const question = document.querySelector('#temp2').content.firstElementChild.cloneNode(true);
		problem.inputs = [question.querySelector('[data-select]'), question.querySelector('[data-input]')];
		SeriesUtil.linkButtonsToInput(question.querySelector('[data-input]'), Array.from(question.querySelector('[data-inputButtons]').children));
		question.querySelector('[data-series]').innerText = `\\[${problem.series}\\]`;
		question.querySelector('[data-question]').innerText = 'By the nth term test, the series: ';
		question.querySelectorAll('[data-select] option')[1].innerText = 'converges';
		question.querySelectorAll('[data-select] option')[2].innerText = 'diverges';
		question.querySelectorAll('[data-select] option')[3].innerText = 'test is inconclusive';
		question.querySelector('[data-question2]').innerText = `because \\( \\lim\\limits_{n \\to \\infty } \\left( ${fractionLatex} \\right) = \\)`;

		problem.question = question;

		return problem;
	},

	generateGeometricProblem() {
		let converges = Math.random() < 0.5;

		const fraction = SeriesUtil.generateGeometricFraction(converges);

		const problem = SeriesUtil.factoryProblem();
		problem.series = `\\sum_{1}^{\\infty} (${fraction.toLatex()})^n`;
		if (converges) {
			problem.answers = ['1', (fraction.toDecimal()) / (1 - fraction.toDecimal())];
		} else {
			problem.answers = ['2', SeriesUtil.autoCorrect];
		}

		const question = document.querySelector('#temp2').content.firstElementChild.cloneNode(true);
		problem.inputs = [question.querySelector('[data-select]'), question.querySelector('[data-input]')];
		SeriesUtil.linkButtonsToInput(question.querySelector('[data-input]'), Array.from(question.querySelector('[data-inputButtons]').children));
		question.querySelector('[data-series]').innerText = `\\[${problem.series}\\]`;
		question.querySelector('[data-question]').innerText = 'By the geometric test, the series: ';
		question.querySelectorAll('[data-select] option')[1].innerText = 'converges';
		question.querySelectorAll('[data-select] option')[2].innerText = 'diverges';
		question.querySelectorAll('[data-select] option')[3].innerText = 'test is inconclusive';
		question.querySelector('[data-question2]').innerText = 'If the series has a finite sum enter it: ';
		problem.question = question;


		const explaination = document.createElement('div');
		if (converges) {
			explaination.innerText = `\\( \\left| r \\right| = \\left| ${fraction.toLatex()} \\right| < 1 \\therefore \\) the series converges by the geometric series test`;
			explaination.innerText += `. The sum of the series is \\( \\frac{a}{1-r} = \\frac{${fraction.toLatex()}}{1-${fraction.toLatex()}} = ${MathUtil.round(problem.answers[1])} \\)`;
		} else {
			explaination.innerText = `\\( \\left| r \\right| = \\left| ${fraction.toLatex()} \\right| > 1 \\therefore \\) the series diverges by the geometric series test and there is no finite sum`;
		}
		problem.explaination = explaination;


		return problem;
	},

	generateGeometricFraction(converges) {
		const high = MathUtil.randomNumber(2, 9);
		const low = MathUtil.randomNumber(1, high - 1);
		const fraction = MathUtil.factoryFraction();
		if (converges) {
			fraction.initialize3(low, high, Math.random() < 0.5);
		} else {
			fraction.initialize3(high, low, Math.random() < 0.5);
		}
		fraction.reduceFraction();
		return fraction;
	},

	generateTelescopingProblem() {
		const a = MathUtil.randomNumber(1, 9);
		const b = MathUtil.randomNumber(1, 9);
		const c = MathUtil.randomNumber(1, 9);

		const problem = SeriesUtil.factoryProblem();
		problem.series = `\\sum_{1}^{\\infty} \\frac{${a}}{${MathUtil.emptyIfOne(b)}n+${c}} - \\frac{${a}}{${MathUtil.emptyIfOne(b)}n+${b + c}}`;
		problem.answers = ['1', a / (b + c)];

		const question = document.querySelector('#temp2').content.firstElementChild.cloneNode(true);
		problem.inputs = [question.querySelector('[data-select]'), question.querySelector('[data-input]')];
		SeriesUtil.linkButtonsToInput(question.querySelector('[data-input]'), Array.from(question.querySelector('[data-inputButtons]').children));
		question.querySelector('[data-series]').innerText = `\\[${problem.series}\\]`;
		question.querySelector('[data-question]').innerText = 'Using the telescoping series test, the series: ';
		question.querySelectorAll('[data-select] option')[1].innerText = 'converges';
		question.querySelectorAll('[data-select] option')[2].innerText = 'diverges';
		question.querySelectorAll('[data-select] option')[3].innerText = 'test is inconclusive';
		question.querySelector('[data-question2]').innerText = 'If the series has a finite sum enter it: ';
		problem.question = question;


		const explaination = document.createElement('div');
		explaination.innerText = `\\( \\lim\\limits_{n \\to \\infty} \\frac{${a}}{${MathUtil.emptyIfOne(b)}n+${b + c}} = L \\therefore \\) the series converges by telescoping series`;
		explaination.innerText += `. The sum of the series is \\( a-L = ${MathUtil.round(problem.answers[1])} \\)`;
		problem.explaination = explaination;

		return problem;
	},

	generateIntegralTestProblem() {
		let converges = Math.random() < 0.5;

		const a = MathUtil.randomNumber(1, 9);
		const b = MathUtil.randomNumber(1, 4);
		const c = MathUtil.randomNumber(1, 4);
		let d;
		if (converges) {
			d = MathUtil.randomNumber(2, 4);
		} else {
			d = 1;
		}

		const problem = SeriesUtil.factoryProblem();
		const fracRef = `\\frac{${a}}{\\left( ${MathUtil.emptyIfOne(b)}n+${c} \\right) ${MathUtil.emptyIfOneExponential(`^${d}`, d)}}`;
		const fracRefX = `\\frac{${a}}{\\left( ${MathUtil.emptyIfOne(b)}x+${c} \\right) ${MathUtil.emptyIfOneExponential(`^${d}`, d)}}`;
		problem.series = `\\sum_{1}^{\\infty} ${fracRef}`;
		if (converges) {
			problem.answers = ['1', a / (b * (d - 1) * ((b + c) ** (d - 1)))];
		} else {
			problem.answers = ['2', SeriesUtil.infSymbol];
		}

		const question = document.querySelector('#temp2').content.firstElementChild.cloneNode(true);
		problem.inputs = [question.querySelector('[data-select]'), question.querySelector('[data-input]')];
		SeriesUtil.linkButtonsToInput(question.querySelector('[data-input]'), Array.from(question.querySelector('[data-inputButtons]').children));
		question.querySelector('[data-series]').innerText = `\\[${problem.series}\\]`;
		question.querySelector('[data-question]').innerText = 'Using the integral test, the series: ';
		question.querySelectorAll('[data-select] option')[1].innerText = 'converges';
		question.querySelectorAll('[data-select] option')[2].innerText = 'diverges';
		question.querySelectorAll('[data-select] option')[3].innerText = 'test is inconclusive';
		question.querySelector('[data-question2]').innerText = `because \\( \\int_{1}^{\\infty}${fracRefX}dx \\) = `;
		problem.question = question;


		const explaination = document.createElement('div');
		if (converges) {
			explaination.innerText = `The series converges because \\( \\int_{1}^{\\infty}${fracRefX}dx = \\frac{${a}}{${b}(${d}-1)(${b + c})^{(${d - 1})}} = ${MathUtil.round(problem.answers[1])} \\)`;
		} else {
			explaination.innerText = `The series diverges because \\( \\int_{1}^{\\infty}${fracRefX}dx = \\frac{${a}}{${b}} \\ln(${b}x+${c}) |^{\\infty}_{1} = ${SeriesUtil.infSymbol} \\)`;
		}
		problem.explaination = explaination;


		return problem;
	},

	generatePSeriesProblem() {
		let converges = Math.random() < 0.5;

		let frac;
		if (converges) {
			frac = `\\frac{1}{n^{${MathUtil.randomNumber(11, 50) / 10}}}`;
		} else {
			if (Math.random() < 0.2) {
				frac = `\\frac{1}{n}`;
			} else {
				frac = `\\frac{1}{n^{${MathUtil.randomNumber(1, 99) / 100}}}`;
			}
		}

		const problem = SeriesUtil.factoryProblem();
		problem.series = `\\sum_{1}^{\\infty} ${frac}`;
		if (converges) {
			problem.answers = ['1', '1'];
		} else {
			problem.answers = ['2', '2'];
		}

		const question = document.querySelector('#temp3').content.firstElementChild.cloneNode(true);
		problem.inputs = [question.querySelector('[data-select]'), question.querySelector('[data-select2]')];
		question.querySelector('[data-series]').innerText = `\\[${problem.series}\\]`;
		question.querySelector('[data-question]').innerText = 'By the p-series test, the series: ';
		question.querySelectorAll('[data-select] option')[1].innerText = 'converges';
		question.querySelectorAll('[data-select] option')[2].innerText = 'diverges';
		question.querySelectorAll('[data-select] option')[3].innerText = 'test is inconclusive';
		question.querySelector('[data-question2]').innerText = 'Because: ';
		question.querySelectorAll('[data-select2] option')[1].innerText = '\\[p \\gt 1\\]';
		question.querySelectorAll('[data-select2] option')[2].innerText = '\\[0 \\lt p \\leq 1\\]';
		question.querySelectorAll('[data-select2] option')[3].innerText = '\\[p \\gt 0\\]';
		problem.question = question;


		const explaination = document.createElement('div');
		if (converges) {
			explaination.innerText = `\\( p > 1 \\therefore \\) the series converges`;
		} else {
			explaination.innerText = `\\( 0 < p \\leq 1 \\therefore \\) the series diverges`;
		}
		problem.explaination = explaination;


		return problem;
	},

	generateDirectComparisonProblem() {
		let converges = Math.random() < 0.5;	//diverge means test fails in this case

		const a = MathUtil.randomNumber(1, 9);
		let bn;
		if (converges) {
			bn = `\\frac{1}{n^{${MathUtil.randomNumber(11, 50) / 10}}}`;
		} else {
			if (Math.random() < 0.2) {
				bn = `\\frac{1}{n}`;
			} else {
				bn = `\\frac{1}{n^{${MathUtil.randomNumber(1, 99) / 100}}}`;
			}
		}
		const an = bn.substring(0, bn.length - 1) + `+${a}}`;
		const bnSeries = `\\sum_{1}^{\\infty} ${bn}`;

		const problem = SeriesUtil.factoryProblem();
		problem.series = `\\sum_{1}^{\\infty} ${an}`;
		if (converges) {
			problem.answers = ['1', '2'];
		} else {
			problem.answers = ['3', '1'];
		}

		const question = document.querySelector('#temp3').content.firstElementChild.cloneNode(true);
		problem.inputs = [question.querySelector('[data-select]'), question.querySelector('[data-select2]')];
		question.querySelector('[data-series]').innerText = `\\[${problem.series}\\]`;
		question.querySelector('[data-question]').innerText = `By the direct comparison test where \\(a_n = ${problem.series} \\) and \\( b_n = ${bnSeries} \\), the series: `;
		question.querySelectorAll('[data-select] option')[1].innerText = 'converges';
		question.querySelectorAll('[data-select] option')[2].innerText = 'diverges';
		question.querySelectorAll('[data-select] option')[3].innerText = 'test is inconclusive';
		question.querySelector('[data-question2]').innerText = `Because \\( b_n \\) is a`;
		question.querySelectorAll('[data-select2] option')[1].innerText = `divergent p-series and bₙ > aₙ`;
		question.querySelectorAll('[data-select2] option')[2].innerText = `convergent p-series and bₙ > aₙ`;
		if (converges) {
			question.querySelectorAll('[data-select2] option')[3].innerText = `convergent p-series and bₙ < aₙ`;
		} else {
			question.querySelectorAll('[data-select2] option')[3].innerText = `divergent p-series and bₙ < aₙ`;
		}
		problem.question = question;


		const explaination = document.createElement('div');
		if (converges) {
			explaination.innerText = `The series \\( b_n = ${problem.series} \\) converges because \\( b_n = ${bnSeries} \\) converges by the p series test and \\( b_n > ${problem.series} \\)`;
		} else {
			explaination.innerText = `The test fails because because \\( b_n = ${bnSeries} \\) diverges by the p series test and \\( b_n > a_n \\)`;
		}
		problem.explaination = explaination;


		return problem;
	},

	generateLimitComparisonProblem() {
		let converges = Math.random() < 0.5;  //converge means inconclusive in this case

		let p;
		if (converges) {
			p = MathUtil.randomNumber(11, 40) / 10;
		} else {
			p = MathUtil.randomNumber(1, 9) / 10;
		}
		const a = MathUtil.randomNumber(2, 4);
		const c = MathUtil.randomNumber(2, 9);
		const d = MathUtil.randomNumber(2, 9);
		const e = MathUtil.randomNumber(1, 9);

		const numer = `${c}x^{${a}} + ${e}`;
		const denom = MathUtil.generatePolynomial2(3, a + p);
		denom.constants[0] = d;
		const fracLatex = `\\frac{${numer}}{${denom.toLatex()}}`;

		const problem = SeriesUtil.factoryProblem();
		problem.series = `\\sum_{1}^{\\infty} ${fracLatex}`;

		if (converges) {
			problem.answers = ['1', p, c / d];
		} else {
			problem.answers = ['2', p, c / d];
		}

		const question = document.querySelector('#temp4').content.firstElementChild.cloneNode(true);
		problem.inputs = [question.querySelector('[data-select]'), question.querySelector('[data-input]'), question.querySelector('[data-input2]')];
		SeriesUtil.linkButtonsToInput(question.querySelector('[data-input2]'), Array.from(question.querySelector('[data-inputButtons2]').children));
		question.querySelector('[data-series]').innerText = `\\[\\sum_{1}^{\\infty} a_n = ${problem.series}\\]`;
		question.querySelector('[data-question]').innerText = `By the limit comparison test the series: `;
		question.querySelectorAll('[data-select] option')[1].innerText = 'converges';
		question.querySelectorAll('[data-select] option')[2].innerText = 'diverges';
		question.querySelectorAll('[data-select] option')[3].innerText = 'test is inconclusive';
		question.querySelector('[data-question2]').innerText = `\\( b_n = \\frac{1}{x^{p}} \\) where \\( p = \\)`;
		question.querySelector('[data-question3]').innerText = `\\( \\lim\\limits_{n \\to \\infty} \\left| \\frac{a_{n}}{b_{n}} \\right| = \\)`;
		problem.question = question;

		const explaination = document.createElement('div');
		if (converges) {
			explaination.innerText = `The series \\( ${problem.series} \\) converges because \\( b_n = \\frac{1}{n^{${a + p}}} \\) converges by the p series test and \\( \\lim\\limits_{n \\to \\infty} \\left| \\frac{a_{n}}{b_{n}} \\right| = \\frac{${c}}{${d}} \\) which is finite`;
		} else {
			explaination.innerText = `The series \\( ${problem.series} \\) diverges because \\( b_n = \\frac{1}{n^{${a + p}}} \\) diverges by the p series test and \\( \\lim\\limits_{n \\to \\infty} \\left| \\frac{a_{n}}{b_{n}} \\right| = \\frac{${c}}{${d}} \\) which is finite`;
		}
		problem.explaination = explaination;

		return problem;
	},

	generateASTProblem() {
		let converges = Math.random() < 0.5;	//diverge means only conditionally convergent

		let p;
		if (converges) {
			p = MathUtil.randomNumber(11, 40) / 10;
		} else {
			p = MathUtil.randomNumber(1, 9) / 10;
		}

		const an = `\\left( -1 \\right)^{\\left( n+1 \\right)} \\left( \\frac{1}{n^{${p}}} \\right)`;

		const problem = SeriesUtil.factoryProblem();
		problem.series = `\\sum_{1}^{\\infty} ${an}`;
		if (converges) {
			problem.answers = ['1', '1'];
		} else {
			problem.answers = ['2', '2'];
		}

		const question = document.querySelector('#temp3').content.firstElementChild.cloneNode(true);
		problem.inputs = [question.querySelector('[data-select]'), question.querySelector('[data-select2]')];
		question.querySelector('[data-series]').innerText = `\\[\\sum_{1}^{\\infty} a_n = ${problem.series}\\]`;
		question.querySelector('[data-question]').innerText = `By the Alternating Sign Test the series: `;
		question.querySelectorAll('[data-select] option')[1].innerText = 'converges absolutely';
		question.querySelectorAll('[data-select] option')[2].innerText = 'converges conditionally';
		question.querySelectorAll('[data-select] option')[3].innerText = 'diverges';
		question.querySelector('[data-question2]').innerText = `Because `;
		question.querySelectorAll('[data-select2] option')[1].innerText = `\\( \\sum \\) aₙ converges by AST  and  \\( \\sum \\) |aₙ| converges by p-series test`;
		question.querySelectorAll('[data-select2] option')[2].innerText = `\\( \\sum \\) aₙ converges by AST  but  \\( \\sum \\) |aₙ| diverges by p-series test`;
		question.querySelectorAll('[data-select2] option')[3].innerText = `\\( \\sum \\) aₙ diverges by AST  and  \\( \\sum \\) |aₙ| diverges by p-series test`;
		problem.question = question;


		const explaination = document.createElement('div');
		if (converges) {
			explaination.innerText = `The series \\( ${problem.series} \\) converges absolutely because \\( \\sum_{1}^{\\infty} a_n \\) converges by AST  and  \\( \\sum_{1}^{\\infty} |a_n| \\) converges by p-series test.`;
		} else {
			explaination.innerText = `The series \\( ${problem.series} \\) converges conditionally because \\( \\sum_{1}^{\\infty} a_n \\) converges by AST  but  \\( \\sum_{1}^{\\infty} |a_n| \\) diverges by p-series test.`;
		}
		problem.explaination = explaination;

		return problem;
	},

	generateRatioTestExpression() {
		let converges = Math.random() < 0.5;

		const a = MathUtil.randomNumber(1, 9);
		const b = MathUtil.randomNumber(1, 9);
		const c = MathUtil.randomNumber(1, 9);
		const high = MathUtil.randomNumber(3, 9);
		const low = MathUtil.randomNumber(2, high - 1);

		let frac;
		if (converges) {
			frac = `\\frac{ \\left( ${MathUtil.emptyIfOne(a)}n+${b} \\right) ${MathUtil.emptyIfOneExponential(`^${c}`, { c })} ${low}^n}{ ${high}^n }`;
		} else {
			frac = `\\frac{ \\left( ${MathUtil.emptyIfOne(a)}n+${b} \\right) ${MathUtil.emptyIfOneExponential(`^${c}`, { c })} ${high}^n}{ ${low}^n }`;
		}

		const problem = SeriesUtil.factoryProblem();
		problem.series = `\\sum_{1}^{\\infty} ${frac}`;
		if (converges) {
			problem.answers = ['1', `${low}/${high}`];
		} else {
			problem.answers = ['2', `${high}/${low}`];
		}

		const question = document.querySelector('#temp2').content.firstElementChild.cloneNode(true);
		problem.inputs = [question.querySelector('[data-select]'), question.querySelector('[data-input]')];
		SeriesUtil.linkButtonsToInput(question.querySelector('[data-input]'), Array.from(question.querySelector('[data-inputButtons]').children));
		question.querySelector('[data-series]').innerText = `\\[${problem.series}\\]`;
		question.querySelector('[data-question]').innerText = 'Using the ratio test, the series: ';
		question.querySelectorAll('[data-select] option')[1].innerText = 'converges';
		question.querySelectorAll('[data-select] option')[2].innerText = 'diverges';
		question.querySelectorAll('[data-select] option')[3].innerText = 'test is inconclusive';
		question.querySelector('[data-question2]').innerText = '\\[ \\lim\\limits_{n \\to \\infty} \\left| \\frac{a_{n+1}}{a_{n}} \\right| = \\]';
		problem.question = question;

		const explaination = document.createElement('div');
		if (converges) {
			fraction = MathUtil.factoryFraction();
			fraction.initialize3(low, high, true);
			fraction.reduceFraction();
			explaination.innerText = `\\( \\lim\\limits_{n \\to \\infty} \\left| \\frac{a_{n+1}}{a_{n}} \\right| = ${fraction.toLatexStandAlone()} < 1 \\therefore \\) the series converges by ratio test`;
		} else {
			fraction = MathUtil.factoryFraction();
			fraction.initialize3(high, low, true);
			fraction.reduceFraction();
			explaination.innerText = `\\( \\lim\\limits_{n \\to \\infty} \\left| \\frac{a_{n+1}}{a_{n}} \\right| = ${fraction.toLatexStandAlone()} > 1 \\therefore \\) the series diverges by ratio test`;
		}
		problem.explaination = explaination;

		return problem;
	},

	generateASTRemainderProblem() {
		const p = MathUtil.randomNumber(1,4);
		const a = MathUtil.randomNumber(1, 9);
		const b = MathUtil.randomNumber(1, 4);
		const d = MathUtil.randomNumber(1, 9);
		const c = MathUtil.randomNumber(2, 5);

		const problem = SeriesUtil.factoryProblem();
		const fracRef = `\\frac{${a}}{ ${MathUtil.emptyIfOne(b)}n${MathUtil.emptyIfOneExponential(`^${p}`, p)} + ${d}}`;
		const firstMissedTermFrac = `\\frac{${a}}{ ${MathUtil.emptyIfOne(b)} (${c+1}) ${MathUtil.emptyIfOneExponential(`^${p}`, p)} + ${d}}`;;
		problem.series = `\\sum_{1}^{\\infty} \\left( -1 \\right)^{n+1} ${fracRef}`;
		problem.answers = ['1', a / ((b * ((c + 1)**p) )  + d)];


		const question = document.querySelector('#temp2').content.firstElementChild.cloneNode(true);
		problem.inputs = [question.querySelector('[data-select]'), question.querySelector('[data-input]')];
		SeriesUtil.linkButtonsToInput(question.querySelector('[data-input]'), Array.from(question.querySelector('[data-inputButtons]').children));
		question.querySelector('[data-series]').innerText = `\\[S_{\\infty}= ${problem.series}\\]`;
		question.querySelector('[data-question]').innerText = 'By the AST, the series: ';
		question.querySelectorAll('[data-select] option')[1].innerText = 'converges';
		question.querySelectorAll('[data-select] option')[2].innerText = 'diverges';
		question.querySelectorAll('[data-select] option')[3].innerText = 'test is inconclusive';
		question.querySelector('[data-question2]').innerText = `The remainder \\( R_{${c}}=\\left|S_{\\infty}-S_{${c}}\\right| \\) is: `;
		problem.question = question;


		const explaination = document.createElement('div');
		explaination.innerText = `The series converges by AST since \\(\\lim\\limits_{n \\to \\infty} a_n = 0 \\) and \\( a_{n+1} \\leq a_{n} \\forall n \\geq 1 \\)`;
		explaination.innerText += `\n \\( R_{${c}}=\\left|S_{\\infty}-S_{${c}}\\right| \\) is the \\(1^{st}\\) missed term of the series = \\( ${firstMissedTermFrac} \\) = ${MathUtil.round(problem.answers[1])}`;
		problem.explaination = explaination;


		return problem;
	},

	generateSequenceProblem1() {
		let converges = Math.random() < 0.5;

		const a = MathUtil.randomNumber(2,9);
		const b = MathUtil.randomNumber(2,9);

		const problem = SeriesUtil.factoryProblem();
		let fracRef;
		if(converges) {
			fracRef = `\\frac{${a}^n \\cdot n^{${b}} \\cdot ln(x)}{n!}`;
		} else {
			fracRef = `\\frac{n!}{${a}^n \\cdot n^{${b}} \\cdot ln(x)}`;
		}
		problem.series = `\\left\\{ ${fracRef} \\right\\}`;
		if (converges) {
			problem.answers = ['1', 0];
		} else {
			problem.answers = ['2', SeriesUtil.infSymbol];
		}

		const question = document.querySelector('#tempSequence').content.firstElementChild.cloneNode(true);
		problem.inputs = [question.querySelector('[data-select]'), question.querySelector('[data-input]')];
		SeriesUtil.linkButtonsToInput(question.querySelector('[data-input]'), Array.from(question.querySelector('[data-inputButtons]').children));
		question.querySelector('[data-series]').innerText = `\\[${problem.series}\\]`;
		problem.question = question;


		const explaination = document.createElement('div');
		if (converges) {
			explaination.innerText = `The sequence converges because \\(\\lim\\limits_{n \\to \\infty} ${fracRef} = 0 \\)`;
		} else {
			explaination.innerText = `The sequence diverges because \\(\\lim\\limits_{n \\to \\infty} ${fracRef} = \\infty \\)`;
		}
		problem.explaination = explaination;

		return problem;
	},

	generateSequenceProblem2() {
		const k = MathUtil.randomNumber(1,5);

		const fracRef = `\\left(1+\\frac{${k}}{n}\\right)^{n}`;

		const problem = SeriesUtil.factoryProblem();
		problem.series = `\\left\\{ ${fracRef} \\right\\}`;
		problem.answers = [`1`, Math.E ** k];

		const question = document.querySelector('#tempSequence').content.firstElementChild.cloneNode(true);
		problem.inputs = [question.querySelector('[data-select]'), question.querySelector('[data-input]')];
		SeriesUtil.linkButtonsToInput(question.querySelector('[data-input]'), Array.from(question.querySelector('[data-inputButtons]').children));
		question.querySelector('[data-series]').innerText = `\\[${problem.series}\\]`;
		problem.question = question;


		const explaination = document.createElement('div');
		explaination.innerText = `The sequence converges because \\(\\lim\\limits_{n \\to \\infty} ${fracRef} = e^{${k}} = ${MathUtil.round(problem.answers[1])} \\)`;
		problem.explaination = explaination;

		return problem;
	},

	generateSequenceProblem3() {
		let converges = Math.random() < 0.5;

		const terms = MathUtil.randomNumber(2, 3);
		const highPower = MathUtil.randomNumber(4,9);
		const lowPower = MathUtil.randomNumber(3, highPower-1);
		const a = MathUtil.generatePolynomial2(terms, highPower);
		const b = MathUtil.generatePolynomial2(terms, lowPower);

		let fracRef;
		if(converges) {
			fracRef = `\\left(-1\\right)^{n} \\frac{${b.toLatex()}}{${a.toLatex()}}`;
		} else {
			fracRef = `\\left(-1\\right)^{n} \\frac{${a.toLatex()}}{${b.toLatex()}}`;
		}

		const problem = SeriesUtil.factoryProblem();
		problem.series = `\\left\\{ ${fracRef} \\right\\}`;
		if (converges) {
			problem.answers = ['1', 0];
		} else {
			problem.answers = ['2', SeriesUtil.dneSymbol];
		}

		const question = document.querySelector('#tempSequence').content.firstElementChild.cloneNode(true);
		problem.inputs = [question.querySelector('[data-select]'), question.querySelector('[data-input]')];
		SeriesUtil.linkButtonsToInput(question.querySelector('[data-input]'), Array.from(question.querySelector('[data-inputButtons]').children));
		question.querySelector('[data-series]').innerText = `\\[${problem.series}\\]`;
		problem.question = question;


		const explaination = document.createElement('div');
		if (converges) {
			explaination.innerText = `The sequence converges because \\(\\lim\\limits_{n \\to \\infty} ${fracRef} = 0 \\)`;
		} else {
			explaination.innerText = `The sequence diverges because \\(\\lim\\limits_{n \\to \\infty} ${fracRef} = \\nexists \\)`;
		}
		problem.explaination = explaination;

		return problem;
	}
}