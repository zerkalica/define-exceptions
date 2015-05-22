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
		if (typeof options === 'string') {
			options = {message: options};
		} else {
			this.message = strMap(messageTemplate, options || {});
		}

		for(var prop in options) {
			if (typeof this[prop] === 'undefined') {
				this[prop] = options[prop];
			}
		}
		this.__options = options;

		Error.captureStackTrace(this, BaseError);
	}

	BaseError.prototype = Object.create(BaseErrorClass.prototype);
	BaseError.prototype.constructor = BaseError;
	BaseError.prototype.toJS = function toJS() {
		var result = {
			name: this.name,
			message: this.message
		};
		for (var name in this.__options) {
			result[name] = this.__options[name];
		}

		return result;
	};

	BaseError.prototype.toJSON = function toJSON() {
		return JSON.stringify(this.toJS());
	};

	BaseError.name = name;
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
