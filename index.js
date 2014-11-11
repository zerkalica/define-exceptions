var augment = require('augment');
var RegExpStringMapper = require('regexp-string-mapper');

var mapper = RegExpStringMapper({
	separator: '%'
});

function Exception(BaseErrorClass, name, messageTemplate) {
	if (typeof BaseErrorClass !== 'function') {
		throw new TypeError('BaseErrorClass is not a function');
	}
	if (!name || typeof name !== 'string') {
		throw new TypeError('name is not a string - need exception class name');
	}
	var BaseError = augment(BaseErrorClass, function init(uber) {
		this.name = name;
		this.constructor = function constructor(options) {
			if (!(this instanceof BaseError)) {
				return new BaseError(options);
			}
			this.message = typeof options === 'string' ? options : mapper.map(messageTemplate, options || {});

			uber.constructor.apply(this, arguments);
			Error.captureStackTrace(this, BaseError);
		};
		
	});

	return BaseError;
}

function Exceptions(BaseErrorClass, map) {
	if (typeof BaseErrorClass !== 'function') {
		throw new TypeError('BaseErrorClass is not a function');
	}
	if (typeof map !== 'object') {
		throw new TypeError('map is not an object hashmap');
	}
	var result = {};
	for (var name in map) {
		result[name] = Exception(BaseErrorClass, name, map[name]);
	}

	return result;
}

function assertOk(condition, Exception, params) {
	if (!condition) {
		throw new Exception(params);
	}
}

module.exports = {
	assertOk: assertOk,
	Exception: Exception,
	Exceptions: Exceptions
};
