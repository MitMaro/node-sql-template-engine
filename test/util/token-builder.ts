import {BinaryOperator, UnaryOperator} from '../../src/operator';
import {
	BinaryToken,
	BoundaryToken,
	EndOfFileToken,
	StatementToken,
	TextLiteralToken,
	TokenBoundaryType,
	TokenStatementType,
	TokenStructureType,
	TokenType,
	TokenValueType,
	UnaryToken,
	ValueToken,
} from '../../src/token';

export function endOfFile(startIndex: number, column?: number, row = 0, file = '<anonymous>'): EndOfFileToken {
	return {
		type: TokenType.Structure,
		subType: TokenStructureType.EndOfFile,
		file,
		column: column === undefined ? startIndex : column,
		row,
		startIndex,
		endIndex: startIndex,
		value: null,
	};
}

export function textLiteral(
	value: string, index: number, column?: number, row = 0, file = '<anonymous>'
): TextLiteralToken {
	return {
		type: TokenType.Structure,
		subType: TokenStructureType.TextLiteral,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + value.length,
		value,
		file,
	};
}

export function tagStart(index: number, column?: number, row = 0, file = '<anonymous>'): BoundaryToken {
	return {
		type: TokenType.Boundary,
		subType: TokenBoundaryType.TagStart,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + 2,
		value: '{{',
		file,
	};
}

export function tagEnd(index: number, column?: number, row = 0, file = '<anonymous>'): BoundaryToken {
	return {
		type: TokenType.Boundary,
		subType: TokenBoundaryType.TagEnd,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + 2,
		value: '}}',
		file,
	};
}

export function ifStatement(index: number, column?: number, row = 0, file = '<anonymous>'): StatementToken {
	return {
		type: TokenType.Statement,
		subType: TokenStatementType.If,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + 2,
		value: 'if',
		file,
	};
}

export function elseIfStatement(index: number, column?: number, row = 0, file = '<anonymous>'): StatementToken {
	return {
		type: TokenType.Statement,
		subType: TokenStatementType.ElseIf,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + 4,
		value: 'elif',
		file,
	};
}

export function elseStatement(index: number, column?: number, row = 0, file = '<anonymous>'): StatementToken {
	return {
		type: TokenType.Statement,
		subType: TokenStatementType.Else,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + 4,
		value: 'else',
		file,
	};
}

export function includeStatement(index: number, column?: number, row = 0, file = '<anonymous>'): StatementToken {
	return {
		type: TokenType.Statement,
		subType: TokenStatementType.Include,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + 7,
		value: 'include',
		file,
	};
}

export function bracketOpen(index: number, column?: number, row = 0, file = '<anonymous>'): BoundaryToken {
	return {
		type: TokenType.Boundary,
		subType: TokenBoundaryType.BracketOpen,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + 1,
		value: '(',
		file,
	};
}

export function bracketClose(index: number, column?: number, row = 0, file = '<anonymous>'): BoundaryToken {
	return {
		type: TokenType.Boundary,
		subType: TokenBoundaryType.BracketClose,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + 1,
		value: ')',
		file,
	};
}

export function variable(name: string, index: number, column?: number, row = 0, file = '<anonymous>'): ValueToken {
	return {
		type: TokenType.Value,
		subType: TokenValueType.Variable,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + name.length,
		value: name,
		file,
	};
}

export function stringValue(
	value: string, index: number, column?: number, row = 0, file = '<anonymous>'
): ValueToken {
	return {
		type: TokenType.Value,
		subType: TokenValueType.String,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + value.length,
		value,
		file,
	};
}

export function integerValue(
	value: string, index: number, column?: number, row = 0, file = '<anonymous>'
): ValueToken {
	return {
		type: TokenType.Value,
		subType: TokenValueType.Integer,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + value.length,
		value,
		file,
	};
}

export function floatingValue(
	value: string, index: number, column?: number, row = 0, file = '<anonymous>'
): ValueToken {
	return {
		type: TokenType.Value,
		subType: TokenValueType.Float,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + value.length,
		value,
		file,
	};
}

const binaryOperatorTokenValues = {
	[BinaryOperator.Equals]: '==',
	[BinaryOperator.NotEquals]: '!=',
	[BinaryOperator.StrictEquals]: '===',
	[BinaryOperator.StrictNotEquals]: '!==',
	[BinaryOperator.And]: '&&',
	[BinaryOperator.Or]: '||',
	[BinaryOperator.GreaterThan]: '>',
	[BinaryOperator.LessThan]: '<',
	[BinaryOperator.GreaterEqualThan]: '>=',
	[BinaryOperator.LessEqualThan]: '<=',
};

export function binaryOperator(
	type: BinaryOperator, index: number, column?: number, row = 0, file = '<anonymous>'
): BinaryToken {
	const value = binaryOperatorTokenValues[type];
	return {
		type: TokenType.BinaryOperator,
		subType: type,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + value.length,
		value,
		file,
	};
}

export function equalsOperator(index: number, column?: number, row = 0, file = '<anonymous>'): BinaryToken {
	return binaryOperator(BinaryOperator.Equals, index, column, row, file);
}

export function notEqualsOperator(index: number, column?: number, row = 0, file = '<anonymous>'): BinaryToken {
	return binaryOperator(BinaryOperator.NotEquals, index, column, row, file);
}

export function strictEqualsOperator(index: number, column?: number, row = 0, file = '<anonymous>'): BinaryToken {
	return binaryOperator(BinaryOperator.StrictEquals, index, column, row, file);
}

export function strictNotEqualsOperator(index: number, column?: number, row = 0, file = '<anonymous>'): BinaryToken {
	return binaryOperator(BinaryOperator.StrictNotEquals, index, column, row, file);
}

export function andOperator(index: number, column?: number, row = 0, file = '<anonymous>'): BinaryToken {
	return binaryOperator(BinaryOperator.And, index, column, row, file);
}

export function orOperator(index: number, column?: number, row = 0, file = '<anonymous>'): BinaryToken {
	return binaryOperator(BinaryOperator.Or, index, column, row, file);
}

export function greaterThanOperator(index: number, column?: number, row = 0, file = '<anonymous>'): BinaryToken {
	return binaryOperator(BinaryOperator.GreaterThan, index, column, row, file);
}

export function lessThanOperator(index: number, column?: number, row = 0, file = '<anonymous>'): BinaryToken {
	return binaryOperator(BinaryOperator.LessThan, index, column, row, file);
}

export function greaterEqualThanOperator(index: number, column?: number, row = 0, file = '<anonymous>'): BinaryToken {
	return binaryOperator(BinaryOperator.GreaterEqualThan, index, column, row, file);
}

export function lessEqualThanOperator(index: number, column?: number, row = 0, file = '<anonymous>'): BinaryToken {
	return binaryOperator(BinaryOperator.LessEqualThan, index, column, row, file);
}

export function notOperator(index: number, column?: number, row = 0, file = '<anonymous>'): UnaryToken {
	return {
		type: TokenType.UnaryOperator,
		subType: UnaryOperator.Not,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + 1,
		value: '!',
		file,
	};
}

export function singleQuote(index: number, column?: number, row = 0, file = '<anonymous>'): BoundaryToken {
	return {
		type: TokenType.Boundary,
		subType: TokenBoundaryType.StringSingle,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + 1,
		value: '\'',
		file,
	};
}

export function doubleQuote(index: number, column?: number, row = 0, file = '<anonymous>'): BoundaryToken {
	return {
		type: TokenType.Boundary,
		subType: TokenBoundaryType.StringDouble,
		column: column === undefined ? index : column,
		row,
		startIndex: index,
		endIndex: index + 1,
		value: '"',
		file,
	};
}
