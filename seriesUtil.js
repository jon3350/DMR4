//used to return a problem object containing a questions the answers and the input DOM elements
//contains methods to check the answer as well


//infinity symbol ∞
//-infinity symbol −∞

SeriesUtil = {
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
				return this.answers.every((x, i) => {
					if (x == '') {
						return true;
					}
					return SeriesUtil.testEquals(this.inputs[i].value, x);
				});
			}
		}
	},

	//test if the input is within three decimal places of answer
	testEquals(input, answer) {
		input = Math.floor(eval(input) * 1000) / 1000;
		answer = eval(answer);
		const truncate = Math.floor(answer * 1000) / 1000;
		const round = lenientRound(answer * 1000) / 1000;

		return input == truncate || input == round;

		//give 0.0001 margin of error for double issues
		function lenientRound(num) {
			return Math.floor(num + 0.5001);
		}
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

		if (highPower == lowPower) {
			converges = false;
		}

		const problem = SeriesUtil.factoryProblem();

		if (!converges) {
			problem.series = `\\sum_{1}^{\\infty} \\frac{${a.toLatex()}}{${b.toLatex()}}`;
			problem.answers = ['2'];
		} else {
			problem.series = `\\sum_{1}^{\\infty} \\frac{${b.toLatex()}}{${a.toLatex()}}`;
			problem.answers = ['3'];
		}

		const question = document.querySelector('#temp1').content.firstElementChild.cloneNode(true);
		problem.inputs = [question.querySelector('[data-select]')];
		question.querySelector('[data-series]').innerText = `\\[${problem.series}\\]`;
		question.querySelector('[data-question]').innerText = 'By the nth term test, the series: ';
		question.querySelectorAll('[data-select] option')[1].innerText = 'converges';
		question.querySelectorAll('[data-select] option')[2].innerText = 'diverges';
		question.querySelectorAll('[data-select] option')[3].innerText = 'test is inconclusive';
		problem.question = question;

		const explaination = document.createElement('div');
		if (highPower == lowPower) {
			newFraction = MathUtil.factoryFraction();
			newFraction.initialize3(Math.abs(a.constants[0]), Math.abs(b.constants[0]), Math.sign(a.constants[0]) == Math.sign(b.constants[0]));
			newFraction.reduceFraction();
			explaination.innerText = `\\( \\lim\\limits_{n \\to \\infty } \\left( \\frac{${a.toLatex()}}{${b.toLatex()}} \\right) = ${newFraction.toLatexStandAlone()} \\neq 0 \\therefore \\) the series diverges`;
		} else if (converges) {
			explaination.innerText = `\\( \\lim\\limits_{n\\to \\infty } \\left( \\frac{${b.toLatex()}}{${a.toLatex()}} \\right) = 0 \\therefore \\) the nth term test fails`;
		} else {
			if (Math.sign(a.constants[0]) == Math.sign(b.constants[0])) {
				explaination.innerText = `\\( \\lim\\limits_{n\\to \\infty } \\left( \\frac{${a.toLatex()}}{${b.toLatex()}} \\right) = \\infty \\neq 0 \\therefore \\) the series diverges`;
			} else {
				explaination.innerText = `\\( \\lim\\limits_{n\\to \\infty } \\left( \\frac{${a.toLatex()}}{${b.toLatex()}} \\right) = -\\infty \\neq 0 \\therefore \\) the series diverges`;
			}
		}
		problem.explaination = explaination;

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
			problem.answers = ['2', ''];
		}

		const question = document.querySelector('#temp2').content.firstElementChild.cloneNode(true);
		problem.inputs = [question.querySelector('[data-select]'), question.querySelector('[data-input]')];
		this.linkButtonsToInput(question.querySelector('[data-input]'), Array.from(question.querySelector('[data-inputButtons]').children) );
		question.querySelector('[data-series]').innerText = `\\[${problem.series}\\]`;
		question.querySelector('[data-question]').innerText = 'By the geometric test, the series: ';
		question.querySelectorAll('[data-select] option')[1].innerText = 'converges';
		question.querySelectorAll('[data-select] option')[2].innerText = 'diverges';
		question.querySelectorAll('[data-select] option')[3].innerText = 'test is inconclusive';
		question.querySelector('[data-question2]').innerText = 'If the series has a sum enter it: ';
		problem.question = question;		
		

		const explaination = document.createElement('div');
		if (converges) {
			explaination.innerText = `\\( \\left| r \\right| = \\left| ${fraction.toLatex()} \\right| < 1 \\therefore \\) the series converges by geometric series`;
			explaination.innerText += `. The sum of the series is \\( \\frac{a}{1-r} = \\frac{${fraction.toLatex()}}{1-${fraction.toLatex()}} = ${problem.answers[1]} \\)`;
		} else {
			explaination.innerText = `\\( \\left| r \\right| = \\left| ${fraction.toLatex()} \\right| > 1 \\therefore \\) the series diverges by geometric series and there is no finite sum`;
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
		problem.inputs = [SeriesUtil.createSelectInput(['1', '2', '3'], ['converges', 'diverges', 'test is inconclusive']), SeriesUtil.createTextInput()];
		problem.answers = ['1', a / (b + c)];


		const question = document.createElement('div');
		const div = document.createElement('div');
		div.innerText = `Consider the following Series: \\[${problem.series}\\]`;
		const span1 = document.createElement('span');
		span1.innerText = `Using the telescoping series test, the series `;
		const span2 = document.createElement('span');
		span2.innerText = `If the series has a sum, enter it to at least 3 decimal places: `;
		question.append(div);
		question.append(span1);
		question.append(problem.inputs[0]);
		question.append(span2);
		question.append(problem.inputs[1]);
		problem.question = question;

		const explaination = document.createElement('div');
		explaination.innerText = `\\( \\lim\\limits_{n \\to \\infty} \\frac{${a}}{${MathUtil.emptyIfOne(b)}n+${c}} - \\frac{${a}}{${MathUtil.emptyIfOne(b)}n+${b + c}} = L \\therefore \\) the series converges by telescoping series`;
		explaination.innerText += `. The sum of the series is \\( a-L = ${problem.answers[1]} \\)`;
		problem.explaination = explaination;


		return problem;
	},

	generateIntegralTestProblem() {
		let converges = Math.random() < 0.5;

		const a = MathUtil.randomNumber(1, 9);
		const b = MathUtil.randomNumber(1, 5);
		const c = MathUtil.randomNumber(1, 5);
		let d;
		if (converges) {
			d = MathUtil.randomNumber(2, 5);
		} else {
			d = 1;
		}

		const problem = SeriesUtil.factoryProblem();
		problem.series = `\\sum_{1}^{\\infty} \\frac{${a}}{\\left( ${MathUtil.emptyIfOne(b)}n+${c} \\right) ${MathUtil.emptyIfOneExponential(`^${d}`, d)}}`;
		problem.inputs = [SeriesUtil.createSelectInput(['1', '2', '3'], ['converges', 'diverges', 'test is inconclusive']), SeriesUtil.createTextInput()];
		if (converges) {
			problem.answers = ['1', a/( b*(d-1)*((b+c)**(d-1)) )];
		} else {
			problem.answers = ['2', ''];
		}

		const question = document.createElement('div');
		const div = document.createElement('div');
		div.innerText = `Consider the following Series: \\[${problem.series}\\]`;
		const span1 = document.createElement('span');
		span1.innerText = `Using the integral test, the series `;
		const span2 = document.createElement('span');
		span2.innerText = `If the integral converges, enter it to at least 3 decimal places `;
		question.append(div);
		question.append(span1);
		question.append(problem.inputs[0]);
		question.append(span2);
		question.append(problem.inputs[1]);
		problem.question = question;

		const explaination = document.createElement('div');
		if (converges) {
			explaination.innerText = `The integral converges (add work later)`;
			explaination.innerText += `. The integral value is ${problem.answers[1]}`;
		} else {
			explaination.innerText = `Take the integral and it diverges (add work later)`;
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
			problem.answers = ['1', '2'];
		} else {
			problem.answers = ['2', '1'];
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
		problem.inputs = [SeriesUtil.createSelectInput(['1', '2', '3'], ['converges', 'diverges', 'test is inconclusive']), SeriesUtil.createTextInput()];
		if (converges) {
			problem.answers = ['1', `${low}/${high}`];
		} else {
			problem.answers = ['2', `${high}/${low}`];
		}

		const question = document.createElement('div');
		const div = document.createElement('div');
		div.innerText = `Consider the following Series: \\[${problem.series}\\]`;
		const span1 = document.createElement('span');
		span1.innerText = `Using the ratio test, the series `;
		const span2 = document.createElement('span');
		span2.innerText = `. Input the limit from the ratio test to 3 decimal places `;
		question.append(div);
		question.append(span1);
		question.append(problem.inputs[0]);
		question.append(span2);
		question.append(problem.inputs[1]);
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
	}
}