'use strict';

import fs from 'fs';
import path from 'path';
import promisify from 'es6-promisify';
import get from 'lodash.get';
import RuntimeError, {
	RuntimeExpressionError,
	RuntimeReadError
} from './error/Runtime';
import Parser from './Parser';
import Lexer from './Lexer';

import {
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
} from './constants';

const readFile = promisify(fs.readFile);

// credit: http://stackoverflow.com/a/9716515/124861
function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function floatEqual(a, b, epsilon) {
	if (a === b) {
		return true;
	}
	const diff = Math.abs(a - b);
	return diff <= epsilon || diff <= Math.min(Math.abs(a), Math.abs(b)) * epsilon;
}

export default class Runner {
	constructor(options = {}) {
		this.epsilon = options.epsilon || Number.EPSILON;
		this.rootPath = options.rootPath || process.cwd();
		this.astCache = new Map();
		this.result = [];
	}

	async invoke(ast, input) {
		this.result = [];
		this.input = input;
		this.currentDataPath = '';
		await this.invokeStatements(ast.statements);
		return this.result;
	}

	async loadSource(templatePath) {
		if (!this.astCache.has(templatePath)) {
			const templateContents = await readFile(templatePath, 'UTF-8');
			this.astCache.set(templatePath, new Parser(new Lexer(templateContents)).generateAST());
		}
		return this.astCache.get(templatePath);
	}

	async invokeStatements(statements) {
		for (const statement of statements) {
			if (statement.type === PARSER_TYPE_TEXT_LITERAL) {
				this.result.push(statement.value);
			}
			else if (statement.type === PARSER_TYPE_INCLUDE) {
				await this.invokeInclude(statement);
			}
			else if (statement.type === PARSER_TYPE_BRANCH) {
				await this.invokeBranch(statement);
			}
			else {
				throw new RuntimeError('Unexpected statement', statement);
			}
		}
	}

	async invokeInclude(statement) {
		let templatePath = statement.value.type === PARSER_TYPE_VARIABLE
			? this.getValueFromVariable(statement.value.name)
			: statement.value.value;

		templatePath = path.isAbsolute(templatePath)
			? path.resolve(templatePath)
			: path.resolve(this.rootPath, templatePath);

		const previousPath = this.currentDataPath;
		if (statement.dataPath) {
			try {
				this.currentDataPath = this.currentDataPath
					? `${this.currentDataPath}.${this.evaluateExpression(statement.dataPath)}`
					: this.evaluateExpression(statement.dataPath)
				;
			}
			catch(e) {
				/* istanbul ignore else */
				if (e instanceof RuntimeExpressionError) {
					throw new RuntimeError(e.message, statement, e);
				}
				// this technically shouldn't be possible
				/* istanbul ignore next */
				throw e;
			}
		}
		let ast;
		try {
			ast = await this.loadSource(templatePath);
		}
		catch(e) {
			/* istanbul ignore else */
			if (e.code === 'EACCES') {
				throw new RuntimeReadError('Permission denied', statement, templatePath);
			}
			else if (e.code === 'ENOENT') {
				throw new RuntimeReadError('File not found', statement, templatePath);
			}
			// who knows what else a file read may throw
			/* istanbul ignore next */
			throw e;
		}
		await this.invokeStatements(ast.statements);
		this.currentDataPath = previousPath;
	}

	async invokeBranch(statement) {
		for (const branch of statement.branches) {
			try {
				if (branch.condition === undefined || this.evaluateExpression(branch.condition)) {
					return await this.invokeStatements(branch.consequent.statements);
				}
			}
			catch(e) {
				/* istanbul ignore else */
				if (e instanceof RuntimeExpressionError) {
					throw new RuntimeError(e.message, statement, e);
				}
				// this technically shouldn't be possible
				/* istanbul ignore next */
				throw e;
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
		throw new RuntimeExpressionError('Unknown expression type');
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

		throw new RuntimeExpressionError('Unknown operator', expression);
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

		throw new RuntimeExpressionError('Unknown operator', expression);
	}

	getValueFromVariable(name) {
		return get(this.input, this.currentDataPath ? `${this.currentDataPath}.${name}` : name);
	}
}

// const util = require('util');
//
// const inputFile = fs.readFileSync(process.argv[2], 'UTF-8');
//
// const ast = new Parser(new Lexer(inputFile)).generateAST();
// console.log('AST');
// console.log(util.inspect(ast, {color: true, depth: null}));
// const runner = new Runner(path.resolve('..', 'test', 'Runtime', 'fixtures'));
//
// console.log('Result');
// runner
// 	.invoke(ast, JSON.parse(process.argv[3]))
// 	.then((result) => console.log(result.join('\n')))
// ;
