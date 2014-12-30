function strMap(template, args) {
	return template.replace(/%(.*?)%/g, function(all, matchName) {
		return args[matchName] || '';
	});
}

function Exception(BaseErrorClass, name, messageTemplate) {
	if (typeof BaseErrorClass !== 'function') {
		throw new TypeError('BaseErrorClass is not a function');
	}
	if (!name || typeof name !== 'string') {
		throw new TypeError('name is not a string - need exception class name');
	}

	function BaseError(options) {
		if (!(this instanceof BaseError)) {
			return new BaseError(options);
		}
		this.name = name;
		this.message = typeof options === 'string' ? options : strMap(messageTemplate, options || {});
		for(var prop in options) {
			this[prop] = options[prop];
		}

		Error.captureStackTrace(this, BaseError);
	}

	BaseError.prototype = Object.create(BaseErrorClass.prototype);
	BaseError.prototype.constructor = BaseError;
	BaseError.ok = function ok(condition, params) {
		if (!condition) {
			throw new BaseError(params);
		}
	};

	return BaseError;
}

Exception.map = function map(BaseErrorClass, map) {
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
};

module.exports = Exception;
