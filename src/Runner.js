'use strict';

const RuntimeError = require('./error/Runtime');

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

	PARSER_TYPE_ROOT,
	PARSER_TYPE_TEXT_LITERAL,
	PARSER_TYPE_INCLUDE,
	PARSER_TYPE_VALUE,
	PARSER_TYPE_VARIABLE,
	PARSER_TYPE_BRANCH,
	PARSER_TYPE_UNARY_OPERATOR,
	PARSER_TYPE_BINARY_OPERATOR
} = require('./constants');

class Runner {
	constructor(ast, input) {
		this.ast = ast;
		this.input = input;
		this.result = [];
	}

	invoke() {
		this.invokeRoot(this.ast);
	}

	invokeRoot(ast) {
		for (const statement in ast.statements) {
			if (statement.type === PARSER_TYPE_TEXT_LITERAL) {
				this.result.push(statement.value);
			}
			else if (statement.type === PARSER_TYPE_INCLUDE) {
				this.invokeInclude(statement);
			}
			else (statement.type === PARSER_TYPE_BRANCH) {
				this.invokeBranch(statement);
			}
		}
	}

	invokeInclude(statement) {
		const path = statement.value;

		if (typeof path !== string) {
			throw new RuntimeError('Non string type passed to include.')
		}
		// TODO: include other file
	}

	invokeBranch(statement) {
		for (const branch of statement.branches) {
			if (this.evaluateExpression(branch.condition)) {

			}
		}
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
			return this.getValueFromVariable(expression.value);
		}
	}

	evaluateBinaryExpression(expression) {
		if (expression.operator === OPERATOR_EQUALS) {
			return this.evaluateExpression(expression.left) == this.evaluateExpression(expression.right);
		}

		if (expression.operator === OPERATOR_NOT_EQUALS) {
			return this.evaluateExpression(expression.left) != this.evaluateExpression(expression.right);
		}

		if (expression.operator === OPERATOR_STRICT_EQUALS) {
			return this.evaluateExpression(expression.left) === this.evaluateExpression(expression.right);
		}

		if (expression.operator === OPERATOR_STRICT_NOT_EQUALS) {
			return this.evaluateExpression(expression.left) !== this.evaluateExpression(expression.right);
		}

		if (expression.operator === OPERATOR_AND) {
			return this.evaluateExpression(expression.left) && this.evaluateExpression(expression.right);
		}

		if (expression.operator === OPERATOR_OR) {
			return this.evaluateExpression(expression.left) || this.evaluateExpression(expression.right);
		}

		throw new RuntimeError(`Unknown operator: ${expression.operator}`);
	}

	evaluateUnaryExpression(expression) {
		if (expression.operator === OPERATOR_NOT) {
			return !this.evaluateExpression(expression.expression);
		}

		throw new RuntimeError(`Unknown operator: ${expression.operator}`);
	}

	getValueFromVariable(name) {
		if (!name in this.input) {
			throw new RuntimeError(`Unset variable: ${name}`);
		}
		return this.input[name];
	}

}
