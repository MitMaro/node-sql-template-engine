'use strict';

import {expect} from 'chai';
import Lexer from '../../src/Lexer';

describe('Lexer.scanTextLiteral', function() {
	it('should scan with empty string', function() {
		const lexer = new Lexer('');

		lexer.scanTextLiteral();
		expect(lexer.pointer).to.equal(0);
	});

	it('should scan with single character', function() {
		const lexer = new Lexer('a');

		lexer.scanTextLiteral();
		expect(lexer.pointer).to.equal(1);
	});

	it('should scan with only one {', function() {
		const lexer = new Lexer('{');

		lexer.scanTextLiteral();
		expect(lexer.pointer).to.equal(1);
	});

	it('should scan with only one { and before characters', function() {
		const lexer = new Lexer('   {');

		lexer.scanTextLiteral();
		expect(lexer.pointer).to.equal(4);
	});

	it('should scan with only one { and after characters', function() {
		const lexer = new Lexer('{   ');

		lexer.scanTextLiteral();
		expect(lexer.pointer).to.equal(4);
	});

	it('should scan with only one { and before and after characters', function() {
		const lexer = new Lexer('  {  ');

		lexer.scanTextLiteral();
		expect(lexer.pointer).to.equal(5);
	});

	it('should scan with both {{', function() {
		const lexer = new Lexer('{{');

		lexer.scanTextLiteral();
		expect(lexer.pointer).to.equal(0);
	});

	it('should scan with both {{ and before characters', function() {
		const lexer = new Lexer('  {{');

		lexer.scanTextLiteral();
		expect(lexer.pointer).to.equal(2);
	});

	it('should scan with both {{ and after characters', function() {
		const lexer = new Lexer('{{  ');

		lexer.scanTextLiteral();
		expect(lexer.pointer).to.equal(0);
	});

	it('should scan with both {{ and before and after characters', function() {
		const lexer = new Lexer('  {{  ');

		lexer.scanTextLiteral();
		expect(lexer.pointer).to.equal(2);
	});
});
