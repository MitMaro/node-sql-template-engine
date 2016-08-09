'use strict';

const async = require('async');
const fs = require('fs');
const RuntimeError = require('./error/Runtime');

const Parser = require('./Parser');
const Lexer = require('./Lexer');

// credit: http://stackoverflow.com/a/9716515/124861
function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function floatEqual(a, b, epsilon = Number.EPSILON) {
	if (a === b) {
		return true;
	}

	const diff = Math.abs(a - b);

	return diff <= epsilon || diff <= Math.min(Math.abs(a), Math.abs(b)) * epsilon;
}

const {
	OPERATOR_EQUALS,
	OPERATOR_NOT_EQUALS,
	OPERATOR_STRICT_EQUALS,
	OPERATOR_STRICT_NOT_EQUALS,
	OPERATOR_AND,
	OPERATOR_OR,
	OPERATOR_NOT,
	OPERATOR_GREATER_THAN,
	OPERATOR_LESS_THAN,
	OPERATOR_GREATER_EQUAL_THAN,
	OPERATOR_LESS_EQUAL_THAN,

	PARSER_TYPE_TEXT_LITERAL,
	PARSER_TYPE_INCLUDE,
	PARSER_TYPE_VALUE,
	PARSER_TYPE_VARIABLE,
	PARSER_TYPE_BRANCH,
	PARSER_TYPE_UNARY_OPERATOR,
	PARSER_TYPE_BINARY_OPERATOR
} = require('./constants');

class Runner {
	constructor(options = { epsilon: Number.EPSILON }) {
		this.epsilon = options.epsilon;
		this.astCache = {};
		this.result = [];
	}

	invoke(ast, input, cb) {
		this.result = [];
		this.input = input;
		this.loadSources(ast.sources, (err) => {
			return err ? cb(err) : cb(null, this.invokeStatements(ast.statements));
		});
	}

	loadSources(sources, cb) {
		const tasks = {};

		for (const value of sources) {
			const path = value.type === PARSER_TYPE_VARIABLE ? this.getValueFromVariable(value.name) : value.value;

			tasks[path] = fs.readFile.bind(fs, path);
		}

		async.parallel(tasks, (err, files) => {
			if (err) {
				return cb(err);
			}
			for (const f in files) {
				this.astCache[f] = new Parser(new Lexer(files[f])).generateAST();
			}
			return cb();
		});
	}

	invokeStatements(statements) {
		for (const statement of statements) {
			if (statement.type === PARSER_TYPE_TEXT_LITERAL) {
				this.result.push(statement.value);
			}
			else if (statement.type === PARSER_TYPE_INCLUDE) {
				this.invokeInclude(statement);
			}
			else if (statement.type === PARSER_TYPE_BRANCH) {
				this.invokeBranch(statement);
			}
			throw new RuntimeError(`Unexpected statement: ${statement}`);
		}
	}

	invokeInclude(statement) {
		const path = statement.value.type === PARSER_TYPE_VARIABLE
			? this.getValueFromVariable(statement.value.name)
			: statement.value.value;

		if (this.astCache[path]) {
			this.invokeStatements(this.astCache[path].statements);
		}
	}

	invokeBranch(statement) {
		for (const branch of statement.branches) {
			if (branch.condition === undefined || this.evaluateExpression(branch.condition)) {
				return this.invokeStatements(branch.consequent.statements);
			}
		}
		// no branch executed
		return null;
	}

	evaluateExpression(expression) {
		if (expression.type === PARSER_TYPE_BINARY_OPERATOR) {
			return this.evaluateBinaryExpression(expression);
		}
		else if (expression.type === PARSER_TYPE_UNARY_OPERATOR) {
			return this.evaluateUnaryExpression(expression);
		}
		else if (expression.type === PARSER_TYPE_VALUE) {
			return expression.value;
		}
		else if (expression.type === PARSER_TYPE_VARIABLE) {
			return this.getValueFromVariable(expression.name);
		}
		throw new RuntimeError(`Unknown expression type: ${expression.type}`);
	}

	evaluateBinaryExpression(expression) {
		const leftValue = this.evaluateExpression(expression.left);
		const rightValue = this.evaluateExpression(expression.right);

		if (expression.operator === OPERATOR_EQUALS) {
			return this.evaluateEquals(leftValue, rightValue);
		}

		if (expression.operator === OPERATOR_NOT_EQUALS) {
			return !this.evaluateEquals(leftValue, rightValue);
		}

		if (expression.operator === OPERATOR_STRICT_EQUALS) {
			return this.evaluateEquals(leftValue, rightValue, true);
		}

		if (expression.operator === OPERATOR_STRICT_NOT_EQUALS) {
			return !this.evaluateEquals(leftValue, rightValue, true);
		}

		if (expression.operator === OPERATOR_GREATER_EQUAL_THAN) {
			return leftValue > rightValue || this.evaluateEquals(leftValue, rightValue);
		}

		if (expression.operator === OPERATOR_LESS_EQUAL_THAN) {
			return leftValue < rightValue || this.evaluateEquals(leftValue, rightValue);
		}

		if (expression.operator === OPERATOR_GREATER_THAN) {
			return leftValue > rightValue;
		}

		if (expression.operator === OPERATOR_LESS_THAN) {
			return leftValue < rightValue;
		}

		if (expression.operator === OPERATOR_AND) {
			return leftValue && rightValue;
		}

		if (expression.operator === OPERATOR_OR) {
			return leftValue || rightValue;
		}

		throw new RuntimeError(`Unknown operator: ${expression.operator}`);
	}

	evaluateEquals(leftValue, rightValue, strict = false) {
		if (isNumeric(leftValue) && isNumeric(rightValue)) {
			return floatEqual(leftValue, rightValue, this.epsilon);
		}
		// eslint-disable-next-line eqeqeq
		return strict ? leftValue === rightValue : leftValue == rightValue;
	}

	evaluateUnaryExpression(expression) {
		if (expression.operator === OPERATOR_NOT) {
			return !this.evaluateExpression(expression.expression);
		}

		throw new RuntimeError(`Unknown operator: ${expression.operator}`);
	}

	getValueFromVariable(name) {
		if (!(name in this.input)) {
			throw new RuntimeError(`Unset variable: ${name}`);
		}
		return this.input[name];
	}

}

module.exports = Runner;
