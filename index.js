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

	var BaseError = augment(BaseErrorClass, function (uber) {
		this.name = name;
		this.constructor = function (options) {
			if (!(this instanceof BaseError)) {
				return new BaseError(options);
			}
			uber.constructor.apply(this, arguments);
			this.message = typeof options === 'string' ? options : mapper.map(messageTemplate, options || {});
			Error.captureStackTrace(this, BaseError);
		};
	});

	BaseError.ok = function ok(condition, params) {
		if (!condition) {
			throw new BaseError(params);
		}
	};

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

module.exports = {
	Exception: Exception,
	Exceptions: Exceptions
};
