require('mocha');
require('chai').should();
var Exception = require('..');

describe('define-exceptions', function () {
	describe('#Exception', function () {
		describe('correct object', function () {
			var err;
			var SuperException = Exception(Error, 'SuperException', 'Super new exception with %foo% and %bar%');
			beforeEach(function () {
				err = new SuperException({foo: 'fooji', bar: 'bark'});
			});
			it('#message', function () {
				err.message.should.be.eql('Super new exception with fooji and bark');
			});
			// aetetic @TODO протестировать стек.
			it('#toString', function () {
				err.toString().should.be.eql('SuperException: Super new exception with fooji and bark');
			});
		});
		describe('empty object', function () {
			var SuperException = Exception(Error, 'SuperException', 'Super new exception with %foo% and %bar%');
			beforeEach(function () {
				err = new SuperException();
			});
			it('#message', function () {
				err.message.should.be.eql('Super new exception with  and ');
			});
			it('#toString', function () {
				err.toString().should.be.eql('SuperException: Super new exception with  and ');
			});
		});
	});
});
