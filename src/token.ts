import {BinaryOperator, UnaryOperator} from './operator';

/** A token type */
export const enum TokenType {
	Structure = 'STRUCTURE',
	Statement = 'STATEMENT',
	Boundary = 'BOUNDARY',
	UnaryOperator = 'UNARY_OPERATOR',
	BinaryOperator = 'BINARY_OPERATOR',
	Value = 'VALUE',
}

/** A token structure sub type */
export const enum TokenStructureType {
	EndOfFile = 'EndOfFile',
	TextLiteral = 'TEXT_LITERAL',
}

/** A token statement sub type */
export const enum TokenStatementType {
	If = 'IF',
	ElseIf = 'ELIF',
	Else = 'ELSE',
	EndIf = 'EndIf',
	Include = 'INCLUDE',
}

/** A token value sub type */
export const enum TokenValueType {
	Variable = 'VARIABLE',
	String = 'STRING',
	Integer = 'INTEGER',
	Float = 'FLOAT',
}

/** A token boundary sub type */
export const enum TokenBoundaryType {
	TagStart = 'TAG_START',
	TagEnd = 'TAG_END',
	BracketOpen = 'BRACKET_OPEN',
	BracketClose = 'BRACKET_CLOSE',
	StringSingle = 'STRING_SINGLE',
	StringDouble = 'STRING_DOUBLE',
}

export type TokenSubType
	= TokenStructureType | TokenStatementType | TokenValueType | TokenBoundaryType | BinaryOperator | UnaryOperator;
export type Token
	= TextLiteralToken | StatementToken | ValueToken | BoundaryToken | BinaryToken | UnaryToken | EndOfFileToken;

export interface BaseToken {
	type: TokenType;
	subType: TokenSubType;
	file: string;
	column: number;
	row: number;
	startIndex: number;
	endIndex: number;
}

export interface TextLiteralToken extends BaseToken {
	type: TokenType.Structure;
	subType: TokenStructureType.TextLiteral;
	value: string;
}

export interface EndOfFileToken extends BaseToken {
	type: TokenType.Structure;
	subType: TokenStructureType.EndOfFile;
	value: null;
}

export interface StatementToken extends BaseToken {
	type: TokenType.Statement;
	subType: TokenStatementType;
	value: string;
}

export interface ValueToken extends BaseToken {
	type: TokenType.Value;
	subType: TokenValueType;
	value: string;
}

export interface BoundaryToken extends BaseToken{
	type: TokenType.Boundary;
	subType: TokenBoundaryType;
	value: string;
}

export interface BinaryToken extends BaseToken {
	type: TokenType.BinaryOperator;
	subType: BinaryOperator;
	value: string;
}

export interface UnaryToken extends BaseToken {
	type: TokenType.UnaryOperator;
	subType: UnaryOperator;
	value: string;
}

/**
 * Guard for EndOfFileToken
 * @hidden
 * @param token The token to check
 * @returns True if the node provided is a EndOfFileToken
 */
export function isEndOfFileToken(token: Token): token is EndOfFileToken {
	return token.type === TokenType.Structure && token.subType === TokenStructureType.EndOfFile;
}

/**
 * Guard for TextLiteralToken
 * @hidden
 * @param token The token to check
 * @returns True if the node provided is a TextLiteralToken
 */
export function isTextLiteralToken(token: Token): token is TextLiteralToken {
	return token.type === TokenType.Structure && token.subType === TokenStructureType.TextLiteral;
}

/**
 * Guard for ValueToken
 * @hidden
 * @param token The token to check
 * @returns True if the node provided is a ValueToken
 */
export function isValueToken(token: Token): token is ValueToken {
	return token.type === TokenType.Value;
}
