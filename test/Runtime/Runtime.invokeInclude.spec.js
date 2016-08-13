'use strict';

const expect = require('chai').expect;
const Runtime = require('../../src/Runtime');
const nb = require('../nodeBuilder');

const includeStatement = nb.root(nb.literal('foo'));

describe('Runtime.invokeInclude', function() {
	let runtime;

	beforeEach(function() {
		runtime = new Runtime();
	});

	it('should include file from static value', function() {
		runtime.astCache = { 'foo.tpl': includeStatement };
		runtime.invokeInclude(
			nb.include(nb.value('foo.tpl'))
		);
		expect(runtime.result).to.deep.equal([ 'foo' ]);
	});

	it('should include file from variable', function() {
		runtime.astCache = { 'foo.tpl': includeStatement };
		runtime.input = { baz: 'foo.tpl' };
		runtime.invokeInclude(
			nb.include(nb.variable('baz'))
		);
		expect(runtime.result).to.deep.equal([ 'foo' ]);
	});
});
