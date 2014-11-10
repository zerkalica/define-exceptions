var augment = require('augment');
var RegExpStringMapper = require('regexp-string-mapper');

var mapper = RegExpStringMapper({
	separator: '%'
});

var Exception = function (BaseErrorClass, name, toString) {
	var BaseError = augment(BaseErrorClass, function (uber) {
		this.name = name;
		this.constructor = function(options) {
			if (!(this instanceof BaseError)) {
				return new BaseError(options);
			}
			// aetetic @TODO Think about how handle empty options
			this.tokens = options || {};

			uber.constructor.apply(this, arguments);
			Error.captureStackTrace(this, BaseError);
			this.message = mapper.map(this.message, this.tokens);
		};

		if (typeof toString === 'string') {
			this.message = toString;
		}

		if(typeof toString === 'function') {
			this.toString = toString.bind(this, this.tokens);
		} else {
			this.toString = function baseToString() {
				return mapper.map(this.message, this.tokens);
			};
		}
	});

	return BaseError;
};

var Exceptions = function (BaseErrorClass, map) {
	var result = {};
	for (var name in map) {
		result[name] = Exception(BaseErrorClass, name, map[name]);
	}

	return result;
};

function assertThrow(condition, Exception, params) {
	if (!condition) {
		throw new Exception(params);
	}
}

module.exports = {
	assertThrow: assertThrow,
	Exception: Exception,
	Exceptions: Exceptions
};
