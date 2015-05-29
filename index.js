/* eslint-env node */
'use strict';
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
        Error.call(this, arguments);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error()).stack;
        }
        if (typeof options === 'string') {
            options = {message: options};
        } else {
            options = options || {};
            options.message = strMap(messageTemplate, options);
        }
        this.name = name;
        options.name = name;
        options.stack = this.stack;
        this.__options = options;
        for (var key in options) {
            if(typeof this[key] === 'undefined') {
                this[key] = options[key];
            }
        }
    }

    BaseError.prototype.name = name;
    BaseError.prototype = Object.create(BaseErrorClass.prototype);
    BaseError.prototype.constructor = BaseError;
    BaseError.prototype.toJS = function toJS() {
        return this.__options;
    };
    BaseError.prototype.toJSON = function toJSON() {
        return JSON.stringify(this.toJS());
    };
    BaseError.ok = function ok(condition, params) {
        if (!condition) {
            throw new BaseError(params);
        }
    };

    return BaseError;
}

Exception.map = function map(BaseErrorClass, exceptionMap) {
    if (typeof BaseErrorClass !== 'function') {
        throw new TypeError('BaseErrorClass is not a function');
    }
    if (typeof exceptionMap !== 'object') {
        throw new TypeError('map is not an object hashmap');
    }
    var result = {};
    for (var name in exceptionMap) {
        result[name] = Exception(BaseErrorClass, name, exceptionMap[name]);
    }

    return result;
};

module.exports = Exception;
