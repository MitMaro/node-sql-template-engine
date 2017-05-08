'use strict';

import {
	OPERATOR_AND,
	OPERATOR_NOT,

	PARSER_TYPE_ROOT,
	PARSER_TYPE_TEXT_LITERAL,
	PARSER_TYPE_INCLUDE,
	PARSER_TYPE_VALUE,
	PARSER_TYPE_VARIABLE,
	PARSER_TYPE_BRANCH,
	PARSER_TYPE_UNARY_OPERATOR,
	PARSER_TYPE_BINARY_OPERATOR,
} from '../src/constants';

export function root(statements) {
	return {
		type: PARSER_TYPE_ROOT,
		statements: Array.isArray(statements) ? statements : [ statements ]
	};
}
export function literal(value, column, row) {
	return {
		type: PARSER_TYPE_TEXT_LITERAL,
		value,
		row,
		column,
	};
}
export function include(value, dataPath) {
	return {
		type: PARSER_TYPE_INCLUDE,
		value,
		dataPath
	};
}
export function value(value, column, row) {
	return {
		type: PARSER_TYPE_VALUE,
		value,
		row,
		column,
	};
}
export function variable(name, column, row) {
	return {
		type: PARSER_TYPE_VARIABLE,
		name,
		row,
		column,
	};
}
export function binaryExpression(left, right, operator) {
	return {
		type: PARSER_TYPE_BINARY_OPERATOR,
		left,
		right,
		operator
	};
}
export function andConditional(left, right) {
	return binaryExpression(left, right, OPERATOR_AND);
}
export function notConditional(expression) {
	return {
		type: PARSER_TYPE_UNARY_OPERATOR,
		operator: OPERATOR_NOT,
		expression
	};
}
export function branch(branches) {
	return {
		type: PARSER_TYPE_BRANCH,
		branches: Array.isArray(branches) ? branches : [ branches ]
	};
}
export function variableConditional(name, column, row, consequent) {
	return conditional(
		variable(name, column, row), consequent
	);
}
export function constantConditional(consequent) {
	return conditional(undefined, consequent);
}
export function conditional(condition, consequent) {
	return {
		condition,
		consequent
	};
}
export function invalidStatement() {
	return {
		type: 'INVALID_STATEMENT',
	};
}
export function invalidExpression() {
	return {
		type: 'INVALID_EXPRESSION',
		left: value('left'),
		right: value('right'),
		operator: 'INVALID'
	};
}
