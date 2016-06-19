'use strict';

const LexerError = require('./error/Lexer');
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
	TOKEN_STATEMENT_ELIF,
	TOKEN_STATEMENT_ELSE,
	TOKEN_STATEMENT_FI,
	TOKEN_STATEMENT_INCLUDE,

	TOKEN_OPERATOR_EQUALS,
	TOKEN_OPERATOR_NOT_EQUALS,
	TOKEN_OPERATOR_STRICT_EQUALS,
	TOKEN_OPERATOR_STRICT_NOT_EQUALS,
	TOKEN_OPERATOR_AND,
	TOKEN_OPERATOR_OR,
	TOKEN_OPERATOR_NOT,
	TOKEN_OPERATOR_GREATER_THAN,
	TOKEN_OPERATOR_LESS_THAN,
	TOKEN_OPERATOR_GREATER_EQUAL_THAN,
	TOKEN_OPERATOR_LESS_EQUAL_THAN
} = require('./constants');

const boundaryTypeLookup = {
	'{{': TOKEN_BOUNDARY_TAG_START,
	'}}': TOKEN_BOUNDARY_TAG_END,
	'(': TOKEN_BOUNDARY_BRACKET_OPEN,
	')': TOKEN_BOUNDARY_BRACKET_CLOSE,
	'"': TOKEN_BOUNDARY_STRING_DOUBLE,
	"'": TOKEN_BOUNDARY_STRING_SINGLE
};

const statementTypeLookup = {
	'if': TOKEN_STATEMENT_IF,
	'elif': TOKEN_STATEMENT_ELIF,
	'else': TOKEN_STATEMENT_ELSE,
	'fi': TOKEN_STATEMENT_FI,
	'include': TOKEN_STATEMENT_INCLUDE
};

const binaryOperatorTypeLookup = {
	'==': TOKEN_OPERATOR_EQUALS,
	'!=': TOKEN_OPERATOR_NOT_EQUALS,
	'===': TOKEN_OPERATOR_STRICT_EQUALS,
	'!==': TOKEN_OPERATOR_STRICT_NOT_EQUALS,
	'&&': TOKEN_OPERATOR_AND,
	'||': TOKEN_OPERATOR_OR,
	'>': TOKEN_OPERATOR_GREATER_THAN,
	'<': TOKEN_OPERATOR_LESS_THAN,
	'>=': TOKEN_OPERATOR_GREATER_EQUAL_THAN,
	'<=': TOKEN_OPERATOR_LESS_EQUAL_THAN
};

const unaryOperatorTypeLookup = {
	'!': TOKEN_OPERATOR_NOT
};

const STATE_TAG = 'TAG';
const STATE_TEXT_LITERAL = 'TEXT';
const STATE_STRING = 'STRING';
const STATE_END_STRING = 'STRING_END';

const generalDelimiters = [
	' ', '\t', '\n'
];

const delimiters = [null, [], [], []];

// build delimiters
Array.prototype.concat(
	generalDelimiters,
	Object.keys(boundaryTypeLookup),
	Object.keys(binaryOperatorTypeLookup),
	Object.keys(unaryOperatorTypeLookup)
).forEach((delimiter) => {
	delimiters[delimiter.length].push(delimiter)
});

class Lexer {
	constructor(input) {
		this.state = STATE_TEXT_LITERAL;
		this.pointer = 0;
		this.input = input;
		// length used for cases of checking ahead by one character from pointer
		this._lookAheadLength = this.input.length -1;
		this._stringDelimiter = null;
	}

	// skip all whitespace or until EOF reached
	_skipWhitespace() {
		while (this.pointer < this.input.length && this.input[this.pointer].trim().length === 0) {
			this.pointer++;
		}
	}

	// scan until {{ is found or EOF reached
	_scanTextLiteral() {
		while (
			this.pointer < this._lookAheadLength
			&& !(
				this.input[this.pointer] === '{'
				&& this.input[this.pointer + 1] === '{'
			)
		) {
			this.pointer++;
		}

		// because we look two characters ahead, we need to increment the
		// pointer by one if end of input is reached
		if (this._lookAheadLength >= 0 && this.pointer >= this._lookAheadLength) {
			this.pointer++;
		}
	}

	//
	_scanString() {
		// if next character is the delimiter we have a zero length string
		if (this.input[this.pointer] === this._stringDelimiter) {
			return;
		}

		while (this.pointer < this._lookAheadLength) {

			// check ahead for delimiter but only if current isn't an escape
			if (this.input[this.pointer + 1] === this._stringDelimiter && this.input[this.pointer] !== '\\') {
				break;
			}

			this.pointer++;
		}
		this.pointer++;
	}

	_isAtDelimiter() {
		for (let length = 3; length > 0; length--) {
			// if we don't have enough input remaining then stop
			if (length + this.pointer > this.input.length) {
				continue;
			}

			d: for (const delimiter of delimiters[length]) {
				// check for match
				for (let i = 0; i < length; i++) {
					if (this.input[this.pointer + i] !== delimiter[i]) {
						continue d;
					}
				}
				// match found so return
				return delimiter;
			}
		}
		return false;
	}


	// scan up to the next delimiter
	_scanToNextDelimiter() {
		// if already at delimiter
		if (this._isAtDelimiter()) {
			return;
		}
		this.pointer++;

		while (this.pointer < this.input.length) {
			if (this._isAtDelimiter()) {
				return;
			}
			this.pointer++;
		}
	}

	// scan pass the next delimiter
	_scanNextDelimiter() {
		const delimiter = this._isAtDelimiter() || '';
		this.pointer += delimiter.length;
	}

	* tokens() {
		while (this.pointer < this.input.length) {
			if (this.state === STATE_TEXT_LITERAL) {
				let startIndex = this.pointer;
				this._scanTextLiteral();
				this.state = STATE_TAG;
				const value = this.input.substring(startIndex, this.pointer);
				if (!value.length) {
					continue;
				}
				yield {
					type: TOKEN_TYPE_STRUCTURE,
					subType: TOKEN_STRUCTURE_TEXT_LITERAL,
					value,
					startIndex,
					endIndex: this.pointer
				};
			}
			else if (this.state === STATE_TAG || this.state === STATE_END_STRING) {
				let type;
				this._skipWhitespace();
				let startIndex = this.pointer;

				// scan until next delimiter
				this._scanToNextDelimiter();
				let value = this.input.substring(startIndex, this.pointer);
				if (value.length) {
					type = statementTypeLookup[value];
					if (type) {
						yield {
							type: TOKEN_TYPE_STATEMENT,
							subType: type,
							value: value,
							startIndex,
							endIndex: this.pointer
						};
						continue;
					}

					// if first digit is a number, it's a numerical value
					if ((value[0] >= '0' && value[0] <= '9') || value[0] === '-')  {
						// floats have a decimal number
						if (value.indexOf('.') !== -1) {
							type = TOKEN_VALUE_FLOAT;
						}
						else {
							type = TOKEN_VALUE_INTEGER;
						}
					}
					else {
						type = TOKEN_VALUE_VARIABLE;
					}

					yield {
						type: TOKEN_TYPE_VALUE,
						subType: type,
						value: value,
						startIndex,
						endIndex: this.pointer
					};
					continue;
				}

				startIndex = this.pointer;
				this._scanNextDelimiter();
				value = this.input.substring(startIndex, this.pointer);
				// boundary types are the most complicated
				type = boundaryTypeLookup[value];
				if (type) {
					if (type === TOKEN_BOUNDARY_STRING_DOUBLE || type === TOKEN_BOUNDARY_STRING_SINGLE) {
						this._stringDelimiter = value;
						this.state = this.state === STATE_END_STRING ? STATE_TAG : STATE_STRING;
					}
					else if (type === TOKEN_BOUNDARY_TAG_END) {
						this.state = STATE_TEXT_LITERAL;
					}
					yield {
						type: TOKEN_TYPE_BOUNDARY,
						subType: type,
						value: value,
						startIndex,
						endIndex: this.pointer
					};
					continue;
				}
				type = binaryOperatorTypeLookup[value];
				if (type) {
					yield {
						type: TOKEN_TYPE_BINARY_OPERATOR,
						subType: type,
						value: value,
						startIndex,
						endIndex: this.pointer
					};
					continue;
				}
				type = unaryOperatorTypeLookup[value];
				yield {
					type: TOKEN_TYPE_UNARY_OPERATOR,
					subType: type,
					value: value,
					startIndex,
					endIndex: this.pointer
				};
			}
			else if (this.state === STATE_STRING) {
				let startIndex = this.pointer;
				this._scanString();
				this.state = STATE_END_STRING;
				yield {
					type: TOKEN_TYPE_VALUE,
					subType: TOKEN_VALUE_STRING,
					value: this.input.substring(startIndex, this.pointer),
					startIndex,
					endIndex: this.pointer
				}
			}
			else {
				throw new LexerError('Invalid state incurred');
			}
		}

		yield {
			type: TOKEN_TYPE_STRUCTURE,
			subType: TOKEN_STRUCTURE_EOF,
			value: null,
			startIndex: this.pointer,
			endIndex: this.pointer
		};
	}
}

module.exports = Lexer;
