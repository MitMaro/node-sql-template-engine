import {BinaryOperator, UnaryOperator} from './operator';

/**
 * An abstract syntax tree node type
 */
export const enum NodeType {
	BinaryExpression = 'BINARY_OPERATOR',
	Branches = 'BRANCHES',
	Branch = 'BRANCH',
	Include = 'INCLUDE',
	Root = 'ROOT',
	TextLiteral = 'LITERAL',
	UnaryExpression = 'UNARY_OPERATOR',
	Value = 'NUMBER_VALUE',
	Variable = 'VARIABLE',
}

export type ValueNode = VariableNode | NumberNode | StringNode;
export type ExpressionNode = BinaryExpressionNode | UnaryExpressionNode | ValueNode;
export type StatementNode = TextLiteralNode | BranchesNode | IncludeNode;

export interface BaseNode {
	type: NodeType;
	column: number;
	row: number;
}

export interface RootNode extends BaseNode {
	type: NodeType.Root;
	statements: StatementNode[];
}

export interface AbstractSyntaxTree extends RootNode {
	templatePath: string;
}

export interface UnaryExpressionNode extends BaseNode {
	type: NodeType.UnaryExpression;
	operator: UnaryOperator;
	expression: ExpressionNode;
}

export interface BinaryExpressionNode extends BaseNode {
	type: NodeType.BinaryExpression;
	operator: BinaryOperator;
	left: ExpressionNode;
	right: ExpressionNode;
}

export interface TextLiteralNode extends BaseNode {
	type: NodeType.TextLiteral;
	value: string;
}

export interface BranchNode extends BaseNode{
	type: NodeType.Branch;
	condition?: ExpressionNode;
	consequent: RootNode;
}

export interface BranchesNode extends BaseNode {
	type: NodeType.Branches;
	branches: BranchNode[];
}

export interface IncludeNode extends BaseNode {
	value: VariableNode | StringNode;
	dataPath?: VariableNode | StringNode;
}

export interface VariableNode extends BaseNode {
	type: NodeType.Variable;
	name: string;
}

export interface NumberNode extends BaseNode {
	type: NodeType.Value;
	value: number;
}

export interface StringNode extends BaseNode {
	type: NodeType.Value;
	value: string;
}

/**
 * Guard for BinaryExpressionNode
 * @hidden
 * @param node The node to check
 * @returns True if the node provided is a BinaryExpressionNode
 */
export function isBinaryOperator(node: BaseNode): node is BinaryExpressionNode {
	return node.type === NodeType.BinaryExpression;
}

/**
 * Guard for BranchNode
 * @hidden
 * @param node The node to check
 * @returns True if the node provided is a BranchNode
 */
export function isBranchesNode(node: BaseNode): node is BranchesNode {
	return node.type === NodeType.Branches;
}

/**
 * Guard for IncludeNode
 * @hidden
 * @param node The node to check
 * @returns True if the node provided is a IncludeNode
 */
export function isIncludeNode(node: BaseNode): node is IncludeNode {
	return node.type === NodeType.Include;
}

/**
 * Guard for TextLiteralNode
 * @hidden
 * @param node The node to check
 * @returns True if the node provided is a TestLiteralNode
 */
export function isTextLiteralNode(node: BaseNode): node is TextLiteralNode {
	return node.type === NodeType.TextLiteral;
}

/**
 * Guard for UnaryExpressionNode
 * @hidden
 * @param node The node to check
 * @returns True if the node provided is a UnaryExpressionNode
 */
export function isUnaryOperator(node: BaseNode): node is UnaryExpressionNode {
	return node.type === NodeType.UnaryExpression;
}

/**
 * Guard for VariableNode
 * @hidden
 * @param node The node to check
 * @returns True if the node provided is a VariableNode
 */
export function isVariableNode(node: BaseNode): node is VariableNode {
	return node.type === NodeType.Variable;
}

/**
 * Guard for NumberNode and StringNode
 * @hidden
 * @param node The node to check
 * @returns True if the node provided is a NumberNode or StringNode
 */
export function isValueNode(node: BaseNode): node is NumberNode | StringNode {
	return node.type === NodeType.Value;
}
