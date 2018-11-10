import {
	AbstractSyntaxTree, BinaryExpressionNode,
	BranchesNode,
	BranchNode,
	ExpressionNode,
	IncludeNode,
	NodeType, NumberNode,
	RootNode,
	StatementNode,
	StringNode,
	TextLiteralNode, UnaryExpressionNode,
	VariableNode,
} from '../../src/abstract-syntax-tree';
import {BinaryOperator, UnaryOperator} from '../../src/operator';

type ValueNode = VariableNode | StringNode;

export function root(statements: StatementNode[], column = 0, row = 0): RootNode {
	return {
		column,
		row,
		type: NodeType.Root,
		statements,
	};
}

export function abstractSyntaxTree(
	statements: StatementNode[], column = 0, row = 0, templatePath = '<anonymous>'
): AbstractSyntaxTree {
	const rootNode = root(statements, column, row);
	(rootNode as AbstractSyntaxTree).templatePath = templatePath;
	return rootNode as AbstractSyntaxTree;
}

export function string(value: string, column = 0, row = 0): StringNode {
	return {
		type: NodeType.Value,
		value,
		row,
		column,
	};
}

export function number(value: number, column = 0, row = 0): NumberNode {
	return {
		type: NodeType.Value,
		value,
		row,
		column,
	};
}

export function variable(name: string, column = 0, row = 0): VariableNode {
	return {
		type: NodeType.Variable,
		name,
		row,
		column,
	};
}

export function literal(value: string, column = 0, row = 0): TextLiteralNode {
	return {
		type: NodeType.TextLiteral,
		value,
		row,
		column,
	};
}

export function include(value: ValueNode, dataPath?: ValueNode, column = 0, row = 0): IncludeNode {
	return {
		type: NodeType.Include,
		value,
		dataPath,
		row,
		column,
	};
}

export function branch(condition: ExpressionNode | undefined, consequent: RootNode, column = 0, row = 0): BranchNode {
	return {
		type: NodeType.Branch,
		row,
		column,
		condition,
		consequent,
	};
}

export function branches(branchNodes: BranchNode[], column = 0, row = 0): BranchesNode {
	return {
		type: NodeType.Branches,
		row,
		column,
		branches: branchNodes,
	};
}

export function binaryExpression(
	left: ExpressionNode,
	operator: BinaryOperator,
	right: ExpressionNode,
	column = 0,
	row = 0,
): BinaryExpressionNode {
	return {
		type: NodeType.BinaryExpression,
		operator,
		left,
		right,
		row,
		column,
	};
}

export function unaryExpression(
	operator: UnaryOperator,
	expression: ExpressionNode,
	column = 0,
	row = 0,
): UnaryExpressionNode {
	return {
		type: NodeType.UnaryExpression,
		operator,
		expression,
		row,
		column,
	};
}
