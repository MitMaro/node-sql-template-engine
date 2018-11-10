import {AbstractSyntaxTree} from './abstract-syntax-tree';

export type TemplateLoader = (file: string) => Promise<AbstractSyntaxTree>;
