import * as path from 'path';

import {expect} from 'chai';
import * as sinon from 'sinon';
import create, {FileLoadError, ParserError} from '../src/';
import {AbstractSyntaxTree} from '../src/abstract-syntax-tree';
import {AbstractSyntaxTreeCache} from '../src/abstract-syntax-tree-cache';
import {RuntimeMaximumCallStackExceededError} from '../src/error/runtime';
import {abstractSyntaxTree, literal} from './util/abstract-syntax-tree-builder';

const templateFilePath = path.resolve(__dirname, 'fixtures', 'template.tpl');

describe('SQL Template Engine', function () {
	it('should invoke a template as an abstract syntax tree', async function () {
		const ast = abstractSyntaxTree([literal('bar')]);
		const {invokeAbstractSyntaxTree} = create();
		expect(await invokeAbstractSyntaxTree(ast, {})).to.deep.equal(['bar']);
	});

	it('should invoke a template file', async function () {
		const {invokeTemplateFile} = create();
		expect(await invokeTemplateFile(templateFilePath, {})).to.deep.equal('bar\n');
	});

	it('should invoke a template file from root path', async function () {
		const {invokeTemplateFile} = create({
			rootPath: path.resolve(__dirname, 'fixtures'),
		});
		expect(await invokeTemplateFile('template.tpl', {})).to.deep.equal('bar\n');
	});

	it('should error on maximum recurse depth is reached', async function () {
		const {invokeTemplateFile} = create({
			rootPath: path.resolve(__dirname, 'fixtures'),
			maximumCallDepth: 1,
		});
		return expect(invokeTemplateFile('recurse.tpl', {})).to.eventually.be.rejectedWith(
			RuntimeMaximumCallStackExceededError, 'Maximum call stack exceeded'
		);
	});

	it('should allow custom cache', async function () {
		const cache: AbstractSyntaxTreeCache = {
			entry: sinon.spy(async (key: string): Promise<AbstractSyntaxTree> => {
				return abstractSyntaxTree([literal(key)]);
			}),
		// tslint:disable-next-line:no-any
		} as any;

		const {invokeTemplateFile} = create({
			cache,
		});
		expect(await invokeTemplateFile(templateFilePath, {})).to.deep.equal(`${templateFilePath}`);
		expect(cache.entry).to.be.calledWith(templateFilePath);
	});

	it('should error on template file not found', async function () {
		const {invokeTemplateFile} = create({
			rootPath: path.resolve(__dirname, 'fixtures'),
		});
		return expect(invokeTemplateFile('template-file-does-not-exist.tpl', {}))
			.to.eventually.be.rejectedWith(FileLoadError, 'File not found');
	});

	it('should error on template cannot be read', async function () {
		const {invokeTemplateFile} = create({
			rootPath: path.resolve(__dirname, 'fixtures'),
		});
		// access-denied.tpl is created in scripts/test.bash
		return expect(invokeTemplateFile('access-denied.tpl', {}))
			.to.eventually.be.rejectedWith(FileLoadError, 'Permission denied');
	});

	it('should error on failure to parse template', async function () {
		const {invokeTemplateFile} = create({
			rootPath: path.resolve(__dirname, 'fixtures'),
		});
		// access-denied.tpl is created in scripts/test.bash
		return expect(invokeTemplateFile('invalid.tpl', {}))
			.to.eventually.be.rejectedWith(ParserError, 'Unexpected token');
	});
});
