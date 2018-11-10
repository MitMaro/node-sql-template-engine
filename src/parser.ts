import {
	AbstractSyntaxTree,
	BranchesNode, BranchNode,
	ExpressionNode,
	IncludeNode,
	NodeType,
	RootNode,
	StatementNode,
	StringNode,
	TextLiteralNode,
	UnaryExpressionNode,
	ValueNode,
	VariableNode,
} from './abstract-syntax-tree';
import {ParserError} from './error/parser';
import {Lexer} from './lexer';
import {BinaryOperator, UnaryOperator} from './operator';
import {
	BinaryToken,
	BoundaryToken,
	isEndOfFileToken,
	isTextLiteralToken,
	isValueToken,
	StatementToken,
	TextLiteralToken,
	Token,
	TokenBoundaryType,
	TokenStatementType,
	TokenStructureType,
	TokenSubType,
	TokenType,
	TokenValueType,
	UnaryToken,
	ValueToken,
} from './token';

/**
 * The operator associativity
 */
enum Associativity {Left, Right}

const precedenceTable: {readonly [operator: string]: {precedence: number; association: Associativity}} = {
	[BinaryOperator.Or]: {precedence: 1, association: Associativity.Left},
	[BinaryOperator.And]: {precedence: 2, association: Associativity.Left},
	[BinaryOperator.Equals]: {precedence: 3, association: Associativity.Left},
	[BinaryOperator.NotEquals]: {precedence: 3, association: Associativity.Left},
	[BinaryOperator.StrictEquals]: {precedence: 3, association: Associativity.Left},
	[BinaryOperator.StrictNotEquals]: {precedence: 3, association: Associativity.Left},
	[BinaryOperator.GreaterThan]: {precedence: 4, association: Associativity.Left},
	[BinaryOperator.LessThan]: {precedence: 4, association: Associativity.Left},
	[BinaryOperator.GreaterEqualThan]: {precedence: 4, association: Associativity.Left},
	[BinaryOperator.LessEqualThan]: {precedence: 4, association: Associativity.Left},
	[UnaryOperator.Not]: {precedence: 5, association: Associativity.Right},
};

/**
 * The parser for the sql templates
 */
export class Parser {
	private readonly lexer: Lexer;
	private readonly tokens: IterableIterator<Token>;
	private readonly nextTokens: Token[];

	/**
	 * Construct a Parser
	 * @param lexer A lexer instance
	 */
	public constructor(lexer: Lexer) {
		this.lexer = lexer;
		this.tokens = this.lexer.tokens();
		this.nextTokens = [];
	}

	/**
	 * Assert that a token type is of a list of particular types
	 * @param token The token to assert
	 * @param types The allowed types
	 * @returns The token that was passed
	 * @throws {ParserError} if the token does not match the passed types
	 */
	private static checkTokenType(token: Token, types: Array<TokenType | TokenSubType>): Token {
		if (Parser.isTokenOfType(token, types) === null) {
			throw new ParserError('Unexpected token', token);
		}
		return token;
	}

	/**
	 * Check that a token type is of a list of particular types
	 * @param token The token to check
	 * @param types The allowed types
	 * @returns The token that was passed if it matches, else null
	 */
	private static isTokenOfType(token: Token, types: Array<TokenType | TokenSubType>): Token | null {
		for (const type of types) {
			if (token.type === type || token.subType === type) {
				return token;
			}
		}
		return null;
	}

	/**
	 * Generate an abstract syntax tree from the tokens provided by the Lexer
	 * @returns The abstract syntax tree
	 * @throws {ParserError} if there are not enough tokens of the token does not match the passed types
	 */
	public generateAbstractSyntaxTree(): AbstractSyntaxTree {
		const abstractSyntaxTree = this.generateRootNode() as AbstractSyntaxTree;
		abstractSyntaxTree.templatePath = this.lexer.templatePath;

		this.getExpectedToken([TokenStructureType.EndOfFile]);
		return abstractSyntaxTree;
	}

	/**
	 * Get a token from the lexer
	 * @returns The token popped
	 * @throws {ParserError} if there are no tokens left
	 */
	private getTokenFromLexer(): Token {
		const token = this.tokens.next();

		if (token.done) {
			throw new ParserError('Unexpected end of tokens', token.value);
		}
		return token.value;
	}

	/**
	 * Get the next token
	 * @returns The token
	 * @throws {ParserError} if there are no tokens left
	 */
	private getNextToken(): Token {
		if (this.nextTokens.length) {
			// eslint-disable-next-line typescript/no-non-null-assertion
			return this.nextTokens.shift()!;
		}
		return this.getTokenFromLexer();
	}

	/**
	 * Utility that gets the next token and checks it against a list of types
	 * @param {Array<TokenType | TokenSubType>} types
	 * @returns The next token
	 * @throws {ParserError} if there are not enough tokens of the token does not match the passed types
	 */
	private getExpectedToken(types: Array<TokenType | TokenSubType>): Token {
		return Parser.checkTokenType(this.getNextToken(), types);
	}

	/**
	 * Lookahead, retrieve the token and check that the token type matches one of a list of types
	 * @param n The number of tokens to lookahead
	 * @param types The allowed types
	 * @returns The token
	 * @throws {ParserError} if there are not enough tokens of the token does not match the passed types
	 */
	private lookahead(n = 1, types?: Array<TokenType | TokenSubType>): Token {
		// skip ahead if needed
		for (let i = this.nextTokens.length; i < n; i++) {
			this.nextTokens.push(this.getTokenFromLexer());
		}

		const token = this.nextTokens[n - 1];

		return types === undefined ? token : Parser.checkTokenType(token, types);
	}

	/**
	 * Generate a text literal node from the tokens
	 * @returns The text literal node
	 * @throws {ParserError} if there are not enough tokens of the token does not match the passed types
	 */
	private generateLiteral(): TextLiteralNode {
		const token = this.getExpectedToken([TokenStructureType.TextLiteral]) as TextLiteralToken;

		return {
			type: NodeType.TextLiteral,
			value: token.value,
			column: token.column,
			row: token.row,
		};
	}

	/**
	 * Generate a unary expression node from the tokens
	 * @returns The unary expression node
	 * @throws {ParserError} if there are not enough tokens of the token does not match the passed types
	 */
	private generateUnaryExpression(): UnaryExpressionNode {
		const token = this.getExpectedToken([TokenType.UnaryOperator]) as UnaryToken;

		return {
			type: NodeType.UnaryExpression,
			operator: token.subType,
			expression: this.generateExpression(precedenceTable[token.subType].precedence),
			row: token.row,
			column: token.column,
		};
	}

	/**
	 * Generate a value node from the tokens
	 * @returns The value node
	 * @throws {ParserError} if there are not enough tokens of the token does not match the passed types
	 */
	private generateValue(): ValueNode {
		const token = this.getExpectedToken([
			TokenType.Value, TokenBoundaryType.StringSingle, TokenBoundaryType.StringDouble,
		]);

		if (isValueToken(token)) {
			if (token.subType === TokenValueType.Variable) {
				return {
					type: NodeType.Variable,
					name: token.value,
					row: token.row,
					column: token.column,
				};
			}

			if (token.subType === TokenValueType.Float) {
				return {
					type: NodeType.Value,
					value: parseFloat(token.value),
					row: token.row,
					column: token.column,
				};
			}
			// else token.subType === TokenValueType.Integer
			return {
				type: NodeType.Value,
				value: parseInt(token.value, 10),
				row: token.row,
				column: token.column,
			};
		}

		let value = (this.getExpectedToken([TokenValueType.String]) as ValueToken).value;
		value = token.subType === TokenBoundaryType.StringSingle
			? value.replace(/\\'/g, '\'').replace(/\\\\/g, '\\')
			: value.replace(/\\"/g, '"').replace(/\\\\/g, '\\');

		// we know the token is a string token here
		this.getExpectedToken([(token as BoundaryToken).subType]);

		return {
			type: NodeType.Value,
			value,
			row: token.row,
			column: token.column,
		};
	}

	/**
	 * Generate an expression value from the tokens
	 * @returns The expression value node
	 * @throws {ParserError} if there are not enough tokens of the token does not match the passed types
	 */
	private generateExpressionValue(): ExpressionNode {
		const token = this.lookahead(1, [
			TokenType.UnaryOperator,
			TokenBoundaryType.BracketOpen,
			TokenBoundaryType.StringDouble,
			TokenBoundaryType.StringSingle,
			TokenType.Value,
		]);

		if (token.type === TokenType.UnaryOperator) {
			return this.generateUnaryExpression();
		}
		else if (token.subType === TokenBoundaryType.BracketOpen) {
			return this.generateBracketExpression();
		}
		// else TokenType.Value
		return this.generateValue();
	}

	/**
	 * Generate an expression from the tokens
	 * @param minPrecedence The minimum precedence of the expression
	 * @returns The expression node
	 * @throws {ParserError} if there are not enough tokens of the token does not match the passed types
	 */
	private generateExpression(minPrecedence = 1): ExpressionNode {
		// perform precedence climbing
		let tree = this.generateExpressionValue();

		while (true) {
			let token = this.lookahead();

			if (token.type !== TokenType.BinaryOperator || precedenceTable[token.subType].precedence < minPrecedence) {
				break;
			}
			token = this.getExpectedToken([TokenType.BinaryOperator]) as BinaryToken;
			const precedenceInfo = precedenceTable[token.subType];
			const nextPrecedence = precedenceInfo.precedence + 1;
			// there currently is no right associative binary operator
			// const nextPrecedence = precedenceInfo.association === Associativity.Left
			//	? precedenceInfo.precedence + 1 : precedenceInfo.precedence;

			tree = {
				type: NodeType.BinaryExpression,
				operator: token.subType,
				left: tree,
				right: this.generateExpression(nextPrecedence),
				row: token.row,
				column: token.column,
			};
		}
		return tree;
	}

	/**
	 * Generate a expression node that is wrapped in brackets
	 * @returns The expression node
	 * @throws {ParserError} if there are not enough tokens of the token does not match the passed types
	 */
	private generateBracketExpression(): ExpressionNode {
		this.getExpectedToken([TokenBoundaryType.BracketOpen]);
		const expression = this.generateExpression();
		this.getExpectedToken([TokenBoundaryType.BracketClose]);
		return expression;
	}

	/**
	 * Generate a branching statement node from the tokens
	 * @returns The branch node
	 * @throws {ParserError} if there are not enough tokens of the token does not match the passed types
	 */
	private generateBranchStatement(): BranchesNode {
		// must start with an IF
		const {row, column} = this.lookahead(2, [TokenStatementType.If]);
		const branches: BranchNode[] = [];

		while (true) {
			let token = this.lookahead(2, [
				TokenStatementType.If,
				TokenStatementType.ElseIf,
				TokenStatementType.Else,
				TokenStatementType.EndIf,
			]);

			const branchRow = token.row;
			const branchColumn = token.column;

			if (token.subType === TokenStatementType.EndIf) {
				break;
			}
			this.getExpectedToken([TokenBoundaryType.TagStart]);
			token = this.getExpectedToken([
				TokenStatementType.If,
				TokenStatementType.ElseIf,
				TokenStatementType.Else,
			]);

			let condition;

			if (token.subType !== TokenStatementType.Else) {
				condition = this.generateExpression();
			}
			// else it's an ELSE token

			this.getExpectedToken([TokenBoundaryType.TagEnd]);
			token = this.lookahead();
			const consequent = this.generateRootNode(token.row, token.column);

			branches.push({
				type: NodeType.Branch,
				row: branchRow,
				column: branchColumn,
				condition,
				consequent,
			});

			// if else statement
			if (condition === undefined) {
				break;
			}
		}

		this.getExpectedToken([TokenBoundaryType.TagStart]);
		this.getExpectedToken([TokenStatementType.EndIf]);
		this.getExpectedToken([TokenBoundaryType.TagEnd]);

		return {
			type: NodeType.Branches,
			branches,
			column,
			row,
		};
	}

	/**
	 * Generate an include statement node from the tokens
	 * @returns The include statement node
	 * @throws {ParserError} if there are not enough tokens of the token does not match the passed types
	 */
	private generateIncludeStatement(): IncludeNode {
		this.getExpectedToken([TokenBoundaryType.TagStart]);
		const includeToken = this.getExpectedToken([TokenStatementType.Include]) as StatementToken;
		const token = this.getExpectedToken([
			TokenValueType.Variable,
			TokenBoundaryType.StringSingle,
			TokenBoundaryType.StringDouble,
		]);

		let value: VariableNode | StringNode;

		if (isValueToken(token)) {
			value = {
				type: NodeType.Variable,
				name: token.value,
				column: token.column,
				row: token.row,
			};
		}
		else { // if token is a string
			value = {
				type: NodeType.Value,
				value: (this.getExpectedToken([TokenValueType.String]) as ValueToken).value,
				column: token.column,
				row: token.row,
			};
			this.getExpectedToken([
				TokenBoundaryType.StringDouble,
				TokenBoundaryType.StringSingle,
			]);
		}

		let dataPath: VariableNode | StringNode | undefined;
		if (Parser.isTokenOfType(this.lookahead(), [
			TokenValueType.Variable,
			TokenBoundaryType.StringSingle,
			TokenBoundaryType.StringDouble,
		])) {
			const dataPathToken = this.getNextToken();
			if (isValueToken(dataPathToken)) {
				dataPath = {
					type: NodeType.Variable,
					name: dataPathToken.value,
					column: dataPathToken.column,
					row: dataPathToken.row,
				};
			}
			else { // if token is a string
				dataPath = {
					type: NodeType.Value,
					value: (this.getExpectedToken([TokenValueType.String]) as ValueToken).value,
					column: dataPathToken.column,
					row: dataPathToken.row,
				};
				this.getExpectedToken([
					TokenBoundaryType.StringDouble,
					TokenBoundaryType.StringSingle,
				]);
			}
		}

		this.getExpectedToken([TokenBoundaryType.TagEnd]);

		return {
			type: NodeType.Include,
			value,
			dataPath,
			row: includeToken.row,
			column: includeToken.column,
		};
	}

	/**
	 * Generate a statement node from the tokens
	 * @returns The statement node
	 * @throws {ParserError} if there are not enough tokens of the token does not match the passed types
	 */
	private generateStatement(): StatementNode {
		const token = this.lookahead(2, [TokenStatementType.If, TokenStatementType.Include]) as StatementToken;

		return (
			token.subType === TokenStatementType.If ? this.generateBranchStatement() : this.generateIncludeStatement()
		);
	}

	/**
	 * Generate a root node
	 * @param row The row number of the start of the root node
	 * @param column The column of the start of the root node
	 * @returns The root node
	 * @throws {ParserError} if there are not enough tokens of the token does not match the passed types
	 */
	private generateRootNode(row = 0, column = 0): RootNode {
		const bodyNode: RootNode = {
			type: NodeType.Root,
			statements: [],
			row,
			column,
		};

		while (true) {
			let token = this.lookahead();

			if (isEndOfFileToken(token)) {
				break;
			}

			// break out of body on end of branch body
			if (
				token.subType === TokenBoundaryType.TagStart
				&& [
					TokenStatementType.ElseIf,
					TokenStatementType.Else,
					TokenStatementType.EndIf,
				].indexOf((this.lookahead(2) as StatementToken).subType) !== -1
			) {
				break;
			}

			token = this.lookahead(1, [
				TokenStructureType.TextLiteral, TokenBoundaryType.TagStart,
			]);

			bodyNode.statements.push(isTextLiteralToken(token) ? this.generateLiteral() : this.generateStatement());
		}
		return bodyNode;
	}
}
