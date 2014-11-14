# define-exceptions

## Single exception

```js
var de = require('define-exceptions');
var SuperException = de.Exception(Error, 'SuperException', 'Super new exception with %foo% and %bar%');

console.log(SuperException instanceof Error); // true

throw new SuperException({foo: 'test1', bar: 'test2'});
//SuperException: Super new exception with test1 and test2
```

## Multiple exceptions

```js
//exceptions.js
var de = require('define-exceptions');

var DiException = de.Exception(Error, 'DiException', 'Unknown MicroDi exception');

var Exceptions = de.Exceptions(DiException, {
    ProtoNotFound: 'Prototype not found in path %path%, params: %params%',
});

Exceptions.DiException = DiException;

module.exports = Exceptions;

```

## Assertions

```js

var Exceptions = require('./exceptions');



throw new Exceptions.ProtoNotFound({path: '/path/to', params: [1, 2, 3]});

Exceptions.ProtoNotFound.ok(false, {path: '/path/to', params: [1, 2, 3]});
```
