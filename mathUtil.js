const MathUtil = {
	//creates a polynomial with constants and powers
	factoryPolynomial() {
		return {
			constants: [],
			powers: [],
			initialize2(constants, powers) {
				this.constants = constants;
				this.powers = powers;
				this.signs = signs;
			},
			initializeRandomConstants(terms) {
				for (let i = 0; i < terms; i++) {
					this.constants.push(MathUtil.randomNumber(1, 9));
				}
			},
			randomlySetNegativeConstants() {
				for (let i = 0; i < this.constants.length; i++) {
					if (Math.random() < 0.5) {
						this.constants[i] *= -1;
					}
				}
			},
			initializeRandomPowers(terms) {
				let highestPower = MathUtil.randomNumber(terms - 1, 9);
				for (let i = 0; i < terms; i++) {
					if (i == 0) {
						this.powers.push(highestPower);
					} else {
						this.powers.push(MathUtil.randomNumber(terms - 1 - i, this.powers[i - 1] - 1));
					}
				}
			},
			toLatex() {
				let s = '';
				for (let i = 0; i < this.constants.length; i++) {
					let c = this.constants[i];

					if (c > 0 && i != 0) {
						s += '+';
					} else if (c < 0) {
						s += '-';
					}

					if (this.powers[i] == 0 || Math.abs(c) != 1) {
						s += Math.abs(c);
					}

					if (this.powers[i] > 1) {
						s += `x^${this.powers[i]}`;
					} else if (this.powers[i] == 1) {
						s += `x`;
					} else if (this.powers[i] == 0) {
						s += '';
					}
				}
				return s;
			}
		}
	},

	factoryFraction() {
		return {
			numerator: 1,
			denominator: 2,
			isPositive: true,
			initialize3(numerator, denominator, isPositive) {
				this.numerator = numerator;
				this.denominator = denominator;
				this.isPositive = isPositive;
			},
			reduceFraction() {
				const gcf = gcd(this.numerator, this.denominator);
				this.numerator /= gcf;
				this.denominator /= gcf;

				function gcd(a, b) {
					if (b) {
						return gcd(b, a % b);
					} else {
						return Math.abs(a);
					}
				}
			},
			toLatex() {
				if (this.numerator == this.denominator) {
					if (!this.isPositive) {
						return '-1';
					} else {
						return '';
					}
				}

				let s = '';
				if (!this.isPositive) {
					s += '-';
				}
				if (this.denominator == 1) {
					return s + this.numerator;
				} else {
					return `${s}\\frac{${this.numerator}}{${this.denominator}}`;
				}
			},
			toLatexStandAlone() {
				let s = '';
				if (!this.isPositive) {
					s += '-';
				}
				if (this.denominator == 1) {
					return s + this.numerator;
				} else {
					return `${s}\\frac{${this.numerator}}{${this.denominator}}`;
				}
			},
			toDecimal() {
				let dec = this.numerator/this.denominator;
				if(!this.isPositive) {
					dec *= -1;
				}
				dec = Math.floor(dec * 1000) / 1000;
				return dec;
			}
		}
	},

	//shortcut for MathJax typeset
	typeset() {
		try {
			MathJax.typeset();
		} catch (error) {

		}
	},

	//return a random number [low,high]
	randomNumber(low, high) {
		return Math.floor(Math.random() * (high - low + 1)) + low;
	},

	//remove 1 from expression 1x
	emptyIfOne(coeficient) {
		if (coeficient == '1') {
			return '';
		} else {
			return coeficient;
		}
	},

	//remove 1 from expression ^1
	emptyIfOneExponential(expression, coeficient) {
		if (coeficient == '1') {
			return '';
		} else {
			return expression;
		}
	},

	//generates a polynomial with random coeficients and powers in descending order
	generatePolynomial(terms) {
		const polynomial = MathUtil.factoryPolynomial();
		polynomial.initializeRandomConstants(terms);
		polynomial.randomlySetNegativeConstants();
		polynomial.initializeRandomPowers(terms);
		return polynomial;
	},

	//generates a polynomial with random coeficients and powers in descending order, given what the highest power is
	//terms <= highestPower+1
	generatePolynomial2(terms, highestPower) {
		if (terms > highestPower + 1) {
			terms = highestPower + 1;
		}
		const polynomial = MathUtil.factoryPolynomial();
		polynomial.initializeRandomConstants(terms);
		polynomial.randomlySetNegativeConstants();
		initializeRandomPowersGivenHighestPower(polynomial, terms, highestPower);
		return polynomial;

		function initializeRandomPowersGivenHighestPower(polynomial, terms, _highestPower) {
			let highestPower = _highestPower;
			for (let i = 0; i < terms; i++) {
				if (i == 0) {
					polynomial.powers.push(highestPower);
				} else {
					polynomial.powers.push(MathUtil.randomNumber(terms - 1 - i, polynomial.powers[i - 1] - 1));
				}
			}
		}
	},

	//generates a reducedFraction with random values
	generateReducedFraction() {
		const fraction = MathUtil.factoryFraction();
		fraction.initialize3(MathUtil.randomNumber(1, 9), MathUtil.randomNumber(1, 9), Math.random() < 0.5);
		fraction.reduceFraction();
		return fraction;
	}

}