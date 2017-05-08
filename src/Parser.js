'use strict';

import ParserError from './error/Parser';

import {
	TOKEN_TYPE_VALUE,
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
} from './constants';

const LEFT_ASSOCIATIVE = 'LEFT_ASSOCIATIVE';
const RIGHT_ASSOCIATIVE = 'RIGHT_ASSOCIATIVE';

const PrecedenceTable = {
	[OPERATOR_OR]: {
		precedence: 1, association: LEFT_ASSOCIATIVE
	},
	[OPERATOR_AND]: {
		precedence: 2, association: LEFT_ASSOCIATIVE
	},
	[OPERATOR_EQUALS]: {
		precedence: 3, association: LEFT_ASSOCIATIVE
	},
	[OPERATOR_NOT_EQUALS]: {
		precedence: 3, association: LEFT_ASSOCIATIVE
	},
	[OPERATOR_STRICT_EQUALS]: {
		precedence: 3, association: LEFT_ASSOCIATIVE
	},
	[OPERATOR_STRICT_NOT_EQUALS]: {
		precedence: 3, association: LEFT_ASSOCIATIVE
	},
	[OPERATOR_GREATER_THAN]: {
		precedence: 4, association: LEFT_ASSOCIATIVE
	},
	[OPERATOR_LESS_THAN]: {
		precedence: 4, association: LEFT_ASSOCIATIVE
	},
	[OPERATOR_GREATER_EQUAL_THAN]: {
		precedence: 4, association: LEFT_ASSOCIATIVE
	},
	[OPERATOR_LESS_EQUAL_THAN]: {
		precedence: 4, association: LEFT_ASSOCIATIVE
	},
	[OPERATOR_NOT]: {
		precedence: 5, association: RIGHT_ASSOCIATIVE
	}
};

export default class Parser {
	constructor(lexer) {
		this.lexer = lexer;
		this.tokens = this.lexer.tokens();
		this.nextTokens = [];
	}

	static checkTokenType(token, types) {
		if (!Parser.isTokenOfType(token, types)) {
			throw new ParserError('Unexpected token', token);
		}
		return token;
	}

	static isTokenOfType(token, types) {
		for (const type of Array.isArray(types) ? types : [ types ]) {
			if (token.type === type || token.subType === type) {
				return token;
			}
		}
	}

	getExpectedToken(types) {
		return Parser.checkTokenType(this.getNextToken(), types);
	}

	lookahead(n = 1, types) {
		// skip ahead if needed
		for (let i = this.nextTokens.length; i < n; i++) {
			this.nextTokens.push(this.popToken());
		}

		const token = this.nextTokens[n - 1];

		return types ? Parser.checkTokenType(token, types) : token;
	}

	getNextToken() {
		if (this.nextTokens.length) {
			return this.nextTokens.shift();
		}
		return this.popToken();
	}

	popToken() {
		const token = this.tokens.next();

		if (token.done) {
			throw new ParserError('Unexpected end of tokens', token);
		}
		return token.value;
	}

	generateAST() {
		const ast = this.generateRootNode();

		this.getExpectedToken(TOKEN_STRUCTURE_EOF);
		return ast;
	}

	generateRootNode() {
		const bodyNode = {
			type: PARSER_TYPE_ROOT,
			statements: []
		};

		while (true) {
			let token = this.lookahead();

			if (token.subType === TOKEN_STRUCTURE_EOF) {
				break;
			}

			// break out of body on end of branch body
			if (
				token.subType === TOKEN_BOUNDARY_TAG_START
				&& [
					TOKEN_STATEMENT_ELIF,
					TOKEN_STATEMENT_ELSE,
					TOKEN_STATEMENT_FI
				].indexOf(this.lookahead(2).subType) !== -1
			) {
				break;
			}

			token = this.lookahead(1, [
				TOKEN_STRUCTURE_TEXT_LITERAL, TOKEN_BOUNDARY_TAG_START
			]);

			bodyNode.statements.push(
				token.subType === TOKEN_STRUCTURE_TEXT_LITERAL
					? this.generateLiteral() : this.generateStatement()
			);
		}
		return bodyNode;
	}

	generateLiteral() {
		const token = this.getExpectedToken(TOKEN_STRUCTURE_TEXT_LITERAL);

		return {
			type: PARSER_TYPE_TEXT_LITERAL,
			value: token.value,
			column: token.column,
			row: token.row
		};
	}

	generateStatement() {
		const token = this.lookahead(2, [TOKEN_STATEMENT_IF, TOKEN_STATEMENT_INCLUDE]);

		return (
			token.subType === TOKEN_STATEMENT_IF ? this.generateBranchStatement() : this.generateIncludeStatement()
		);
	}

	generateBranchStatement() {
		// must start with an IF
		this.lookahead(2, TOKEN_STATEMENT_IF);
		const branches = [];

		while (true) {
			let token = this.lookahead(2, [
				TOKEN_STATEMENT_IF,
				TOKEN_STATEMENT_ELIF,
				TOKEN_STATEMENT_ELSE,
				TOKEN_STATEMENT_FI
			]);

			if (token.subType === TOKEN_STATEMENT_FI) {
				break;
			}
			this.getExpectedToken(TOKEN_BOUNDARY_TAG_START);
			token = this.getExpectedToken([
				TOKEN_STATEMENT_IF,
				TOKEN_STATEMENT_ELIF,
				TOKEN_STATEMENT_ELSE
			]);

			let condition;

			if (token.subType !== TOKEN_STATEMENT_ELSE) {
				condition = this.generateExpression();
			}
			// else it's an ELSE token

			this.getExpectedToken(TOKEN_BOUNDARY_TAG_END);
			const consequent = this.generateRootNode();

			branches.push({
				condition, consequent
			});
		}

		this.getExpectedToken(TOKEN_BOUNDARY_TAG_START);
		this.getExpectedToken(TOKEN_STATEMENT_FI);
		this.getExpectedToken(TOKEN_BOUNDARY_TAG_END);

		return {
			type: PARSER_TYPE_BRANCH,
			branches
		};
	}

	generateIncludeStatement() {
		this.getExpectedToken(TOKEN_BOUNDARY_TAG_START);
		this.getExpectedToken(TOKEN_STATEMENT_INCLUDE);
		const token = this.getExpectedToken([
			TOKEN_VALUE_VARIABLE,
			TOKEN_BOUNDARY_STRING_SINGLE,
			TOKEN_BOUNDARY_STRING_DOUBLE
		]);

		let value;

		if (token.subType === TOKEN_VALUE_VARIABLE) {
			value = {
				type: PARSER_TYPE_VARIABLE,
				name: token.value,
				column: token.column,
				row: token.row,
			};
		}
		else { // if token is a string
			value = {
				type: PARSER_TYPE_VALUE,
				value: this.getExpectedToken(TOKEN_VALUE_STRING).value,
				column: token.column,
				row: token.row,
			};
			this.getExpectedToken([
				TOKEN_BOUNDARY_STRING_DOUBLE,
				TOKEN_BOUNDARY_STRING_SINGLE
			]);
		}

		let dataPath;
		if (Parser.isTokenOfType(this.lookahead(), [
			TOKEN_VALUE_VARIABLE,
			TOKEN_BOUNDARY_STRING_SINGLE,
			TOKEN_BOUNDARY_STRING_DOUBLE
		])) {
			const nextToken = this.getNextToken();
			if (nextToken.subType === TOKEN_VALUE_VARIABLE) {
				dataPath = {
					type: PARSER_TYPE_VARIABLE,
					name: nextToken.value,
					column: nextToken.column,
					row: nextToken.row,
				};
			}
			else { // if token is a string
				dataPath = {
					type: PARSER_TYPE_VALUE,
					value: this.getExpectedToken(TOKEN_VALUE_STRING).value,
					column: nextToken.column,
					row: nextToken.row,
				};
				this.getExpectedToken([
					TOKEN_BOUNDARY_STRING_DOUBLE,
					TOKEN_BOUNDARY_STRING_SINGLE
				]);
			}
		}

		this.getExpectedToken(TOKEN_BOUNDARY_TAG_END);

		return {
			type: PARSER_TYPE_INCLUDE,
			value,
			dataPath
		};
	}

	generateExpression(minPrecedence = 1) {
		// perform precedence climbing
		let tree = this.generateExpressionValue();

		while (true) {
			let token = this.lookahead();

			if (
				token.type !== TOKEN_TYPE_BINARY_OPERATOR
				|| PrecedenceTable[token.subType].precedence < minPrecedence
			) {
				break;
			}
			token = this.getExpectedToken(TOKEN_TYPE_BINARY_OPERATOR);
			const precedenceInfo = PrecedenceTable[token.subType];
			const nextPrecedence = precedenceInfo.precedence + 1;
			// there currently is no right associative binary operator
			// const nextPrecedence = precedenceInfo.association === LEFT_ASSOCIATIVE
			//	? precedenceInfo.precedence + 1 : precedenceInfo.precedence;

			tree = {
				type: PARSER_TYPE_BINARY_OPERATOR,
				left: tree,
				right: this.generateExpression(nextPrecedence),
				operator: token.subType
			};
		}
		return tree;
	}

	generateExpressionValue() {
		const token = this.lookahead(1, [
			TOKEN_TYPE_UNARY_OPERATOR,
			TOKEN_BOUNDARY_BRACKET_OPEN,
			TOKEN_BOUNDARY_STRING_DOUBLE,
			TOKEN_BOUNDARY_STRING_SINGLE,
			TOKEN_TYPE_VALUE
		]);

		if (token.type === PARSER_TYPE_UNARY_OPERATOR) {
			return this.generateUnaryExpression();
		}
		else if (token.subType === TOKEN_BOUNDARY_BRACKET_OPEN) {
			return this.generateBracketExpression();
		}
		 // else TOKEN_TYPE_VALUE
		return this.generateValue();
	}

	generateUnaryExpression() {
		const token = this.getExpectedToken(TOKEN_TYPE_UNARY_OPERATOR);

		return {
			type: PARSER_TYPE_UNARY_OPERATOR,
			operator: token.subType,
			expression: this.generateExpression(PrecedenceTable[token.subType].precedence),
		};
	}

	generateBracketExpression() {
		this.getExpectedToken(TOKEN_BOUNDARY_BRACKET_OPEN);

		const expression = this.generateExpression();

		this.getExpectedToken(TOKEN_BOUNDARY_BRACKET_CLOSE);
		return expression;
	}

	generateValue() {
		const token = this.getExpectedToken([
			TOKEN_TYPE_VALUE, TOKEN_BOUNDARY_STRING_SINGLE, TOKEN_BOUNDARY_STRING_DOUBLE
		]);

		if (token.subType === TOKEN_VALUE_VARIABLE) {
			return {
				type: PARSER_TYPE_VARIABLE,
				name: token.value,
				row: token.row,
				column: token.column,
			};
		}

		let value;

		if (token.subType === TOKEN_BOUNDARY_STRING_SINGLE || token.subType === TOKEN_BOUNDARY_STRING_DOUBLE) {
			value = this.getExpectedToken(TOKEN_VALUE_STRING).value;
			this.getExpectedToken(token.subType);
		}

		if (token.subType === TOKEN_VALUE_FLOAT) {
			value = parseFloat(token.value);
		}
		else if (token.subType === TOKEN_VALUE_INTEGER) {
			value = parseInt(token.value, 10);
		}

		return {
			type: PARSER_TYPE_VALUE,
			value,
			row: token.row,
			column: token.column,
		};
	}
}
