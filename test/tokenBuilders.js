'use strict';

const {
	TOKEN_TYPE_VALUE,
	TOKEN_TYPE_STRUCTURE,
	TOKEN_TYPE_STATEMENT,
	TOKEN_TYPE_BOUNDARY,
	TOKEN_TYPE_UNARY_OPERATOR,
	TOKEN_TYPE_BINARY_OPERATOR,
	TOKEN_VALUE_VARIABLE,
	TOKEN_VALUE_STRING,
	TOKEN_VALUE_INTEGER,
	TOKEN_VALUE_FLOAT,
	TOKEN_STRUCTURE_TEXT_LITERAL,
	TOKEN_STRUCTURE_EOF,
	TOKEN_BOUNDARY_TAG_START,
	TOKEN_BOUNDARY_TAG_END,
	TOKEN_BOUNDARY_BRACKET_OPEN,
	TOKEN_BOUNDARY_BRACKET_CLOSE,
	TOKEN_BOUNDARY_STRING_SINGLE,
	TOKEN_BOUNDARY_STRING_DOUBLE,
	TOKEN_STATEMENT_IF,
	OPERATOR_AND,
	OPERATOR_NOT
} = require('../src/constants');

module.exports = {
	textLiteral(index, value) {
		return {
			type: TOKEN_TYPE_STRUCTURE,
			subType: TOKEN_STRUCTURE_TEXT_LITERAL,
			startIndex: index,
			endIndex: index + value.length,
			value
		};
	},
	endOfFile(length) {
		return {
			type: TOKEN_TYPE_STRUCTURE,
			subType: TOKEN_STRUCTURE_EOF,
			startIndex: length,
			endIndex: length,
			value: null
		};
	},
	startTag(index) {
		return {
			type: TOKEN_TYPE_BOUNDARY,
			subType: TOKEN_BOUNDARY_TAG_START,
			startIndex: index,
			endIndex: index + 2,
			value: '{{'
		};
	},
	endTag(index) {
		return {
			type: TOKEN_TYPE_BOUNDARY,
			subType: TOKEN_BOUNDARY_TAG_END,
			startIndex: index,
			endIndex: index + 2,
			value: '}}'
		};
	},
	ifStatement(index) {
		return {
			type: TOKEN_TYPE_STATEMENT,
			subType: TOKEN_STATEMENT_IF,
			startIndex: index,
			endIndex: index + 2,
			value: 'if'
		};
	},
	variable(index, value) {
		return {
			type: TOKEN_TYPE_VALUE,
			subType: TOKEN_VALUE_VARIABLE,
			startIndex: index,
			endIndex: index + value.length,
			value
		};
	},
	string(index, value) {
		return {
			type: TOKEN_TYPE_VALUE,
			subType: TOKEN_VALUE_STRING,
			startIndex: index,
			endIndex: index + value.length,
			value
		};
	},
	stringSingle(index) {
		return {
			type: TOKEN_TYPE_BOUNDARY,
			subType: TOKEN_BOUNDARY_STRING_SINGLE,
			startIndex: index,
			endIndex: index + 1,
			value: '\''
		};
	},
	stringDouble(index) {
		return {
			type: TOKEN_TYPE_BOUNDARY,
			subType: TOKEN_BOUNDARY_STRING_DOUBLE,
			startIndex: index,
			endIndex: index + 1,
			value: '"'
		};
	},
	bracketOpen(index) {
		return {
			type: TOKEN_TYPE_BOUNDARY,
			subType: TOKEN_BOUNDARY_BRACKET_OPEN,
			startIndex: index,
			endIndex: index + 1,
			value: '('
		};
	},
	bracketClose(index) {
		return {
			type: TOKEN_TYPE_BOUNDARY,
			subType: TOKEN_BOUNDARY_BRACKET_CLOSE,
			startIndex: index,
			endIndex: index + 1,
			value: ')'
		};
	},
	andOperator(index) {
		return {
			type: TOKEN_TYPE_BINARY_OPERATOR,
			subType: OPERATOR_AND,
			startIndex: index,
			endIndex: index + 2,
			value: '&&'
		};
	},
	notOperator(index) {
		return {
			type: TOKEN_TYPE_UNARY_OPERATOR,
			subType: OPERATOR_NOT,
			startIndex: index,
			endIndex: index + 1,
			value: '!'
		};
	},
	integer(index, value) {
		return {
			type: TOKEN_TYPE_VALUE,
			subType: TOKEN_VALUE_INTEGER,
			startIndex: index,
			endIndex: index + value.length,
			value
		};
	},
	float(index, value) {
		return {
			type: TOKEN_TYPE_VALUE,
			subType: TOKEN_VALUE_FLOAT,
			startIndex: index,
			endIndex: index + value.length,
			value
		};
	}
};
