'use strict';

import {
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
	OPERATOR_NOT,
} from '../src/constants';


export function textLiteral(index, value, column, row = 0) {
	return {
		type: TOKEN_TYPE_STRUCTURE,
		subType: TOKEN_STRUCTURE_TEXT_LITERAL,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + value.length,
		value
	};
}
export function endOfFile(length, column, row = 0) {
	return {
		type: TOKEN_TYPE_STRUCTURE,
		subType: TOKEN_STRUCTURE_EOF,
		column: column === undefined ? length : column,
		row,
		startIndex: length,
		endIndex: length,
		value: null
	};
}
export function startTag(index, column, row = 0) {
	return {
		type: TOKEN_TYPE_BOUNDARY,
		subType: TOKEN_BOUNDARY_TAG_START,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + 2,
		value: '{{'
	};
}
export function endTag(index, column, row = 0) {
	return {
		type: TOKEN_TYPE_BOUNDARY,
		subType: TOKEN_BOUNDARY_TAG_END,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + 2,
		value: '}}'
	};
}
export function ifStatement(index, column, row = 0) {
	return {
		type: TOKEN_TYPE_STATEMENT,
		subType: TOKEN_STATEMENT_IF,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + 2,
		value: 'if'
	};
}
export function variable(index, value, column, row = 0) {
	return {
		type: TOKEN_TYPE_VALUE,
		subType: TOKEN_VALUE_VARIABLE,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + value.length,
		value
	};
}
export function string(index, value, column, row = 0) {
	return {
		type: TOKEN_TYPE_VALUE,
		subType: TOKEN_VALUE_STRING,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + value.length,
		value
	};
}
export function stringSingle(index, column, row = 0) {
	return {
		type: TOKEN_TYPE_BOUNDARY,
		subType: TOKEN_BOUNDARY_STRING_SINGLE,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + 1,
		value: '\''
	};
}
export function stringDouble(index, column, row = 0) {
	return {
		type: TOKEN_TYPE_BOUNDARY,
		subType: TOKEN_BOUNDARY_STRING_DOUBLE,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + 1,
		value: '"'
	};
}
export function bracketOpen(index, column, row = 0) {
	return {
		type: TOKEN_TYPE_BOUNDARY,
		subType: TOKEN_BOUNDARY_BRACKET_OPEN,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + 1,
		value: '('
	};
}
export function bracketClose(index, column, row = 0) {
	return {
		type: TOKEN_TYPE_BOUNDARY,
		subType: TOKEN_BOUNDARY_BRACKET_CLOSE,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + 1,
		value: ')'
	};
}
export function andOperator(index, column, row = 0) {
	return {
		type: TOKEN_TYPE_BINARY_OPERATOR,
		subType: OPERATOR_AND,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + 2,
		value: '&&'
	};
}
export function notOperator(index, column, row = 0) {
	return {
		type: TOKEN_TYPE_UNARY_OPERATOR,
		subType: OPERATOR_NOT,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + 1,
		value: '!'
	};
}
export function integer(index, value, column, row = 0) {
	return {
		type: TOKEN_TYPE_VALUE,
		subType: TOKEN_VALUE_INTEGER,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + value.length,
		value
	};
}
export function float(index, value, column, row = 0) {
	return {
		type: TOKEN_TYPE_VALUE,
		subType: TOKEN_VALUE_FLOAT,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + value.length,
		value
	};
}
