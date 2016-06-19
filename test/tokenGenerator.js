'use strict';

module.exports = {
	textLiteral(startIndex, value) {
		return {
			type: 'STRUCTURE',
			subType: 'TEXT_LITERAL',
			startIndex: startIndex,
			endIndex: startIndex + value.length,
			value: value
		};
	},
	endOfFile(length) {
		return {
			type: 'STRUCTURE',
			subType: 'EOF',
			startIndex: length,
			endIndex: length,
			value: null
		};
	},
	startTag(index) {
		return {
			type: 'BOUNDARY',
			subType: 'TAG_START',
			startIndex: index,
			endIndex: index + 2,
			value: '{{'
		};
	},
	endTag(index) {
		return {
			type: 'BOUNDARY',
			subType: 'TAG_END',
			startIndex: index,
			endIndex: index + 2,
			value: '}}'
		};
	},
	ifStatement(index) {
		return {
			type: 'STATEMENT',
			subType: 'IF',
			startIndex: index,
			endIndex: index + 2,
			value: 'if'
		};
	},
	variable(index, value) {
		return {
			type: 'VALUE',
			subType: 'VARIABLE',
			startIndex: index,
			endIndex: index + value.length,
			value: value
		};
	},
	string(index, value) {
		return {
			type: 'VALUE',
			subType: 'STRING',
			startIndex: index,
			endIndex: index + value.length,
			value: value
		};
	},
	stringSingle(index) {
		return {
			type: 'BOUNDARY',
			subType: 'STRING_SINGLE',
			startIndex: index,
			endIndex: index + 1,
			value: '\''
		};
	},
	stringDouble(index) {
		return {
			type: 'BOUNDARY',
			subType: 'STRING_DOUBLE',
			startIndex: index,
			endIndex: index + 1,
			value: '"'
		};
	},
	bracketOpen(index) {
		return {
			type: 'BOUNDARY',
			subType: 'BRACKET_OPEN',
			startIndex: index,
			endIndex: index + 1,
			value: '('
		};
	},
	bracketClose(index) {
		return {
			type: 'BOUNDARY',
			subType: 'BRACKET_CLOSE',
			startIndex: index,
			endIndex: index + 1,
			value: ')'
		};
	},
	andOperator(index) {
		return {
			type: 'BINARY_OPERATOR',
			subType: 'AND',
			startIndex: index,
			endIndex: index + 2,
			value: '&&'
		};
	},
	notOperator(index) {
		return {
			type: 'UNARY_OPERATOR',
			subType: 'NOT',
			startIndex: index,
			endIndex: index + 1,
			value: '!'
		};
	},
	integer(index, value) {
		return {
			type: 'VALUE',
			subType: 'INTEGER',
			startIndex: index,
			endIndex: index + value.length,
			value: value
		};
	},
	float(index, value) {
		return {
			type: 'VALUE',
			subType: 'FLOAT',
			startIndex: index,
			endIndex: index + value.length,
			value: value
		};
	}
};
