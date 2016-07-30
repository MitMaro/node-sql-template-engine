'use strict';

const {
	OPERATOR_AND,
	OPERATOR_NOT,

	PARSER_TYPE_ROOT,
	PARSER_TYPE_TEXT_LITERAL,
	PARSER_TYPE_INCLUDE,
	PARSER_TYPE_VALUE,
	PARSER_TYPE_VARIABLE,
	PARSER_TYPE_BRANCH,
	PARSER_TYPE_UNARY_OPERATOR,
	PARSER_TYPE_BINARY_OPERATOR
} = require('../src/constants');

module.exports = {
	root(statements) {
		return {
			type: PARSER_TYPE_ROOT,
			statements: Array.isArray(statements) ? statements : [ statements ]
		};
	},
	literal(value) {
		return {
			type: PARSER_TYPE_TEXT_LITERAL,
			value
		};
	},
	include(value) {
		return {
			type: PARSER_TYPE_INCLUDE,
			value
		};
	},
	value(value) {
		return {
			type: PARSER_TYPE_VALUE,
			value
		};
	},
	variable(name) {
		return {
			type: PARSER_TYPE_VARIABLE,
			name
		};
	},
	binaryExpression(left, right, operator) {
		return {
			type: PARSER_TYPE_BINARY_OPERATOR,
			left,
			right,
			operator
		};
	},
	andConditional(left, right) {
		return module.exports.binaryExpression(left, right, OPERATOR_AND);
	},
	notConditional(expression) {
		return {
			type: PARSER_TYPE_UNARY_OPERATOR,
			operator: OPERATOR_NOT,
			expression
		};
	},
	branch(branches) {
		return {
			type: PARSER_TYPE_BRANCH,
			branches: Array.isArray(branches) ? branches : [ branches ]
		};
	},
	variableConditional(name, consequent) {
		return module.exports.conditional(
			module.exports.variable(name), consequent
		);
	},
	constantConditional(consequent) {
		return module.exports.conditional(undefined, consequent);
	},
	conditional(condition, consequent) {
		return {
			condition,
			consequent
		};
	}
};
