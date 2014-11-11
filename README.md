# define-exceptions

```js
var de = require('define-exceptions');
var SuperException = de.Exception(Error, 'SuperException', 'Super new exception with %foo% and %bar%');

console.log(SuperException instanceof Error); // true

throw new SuperException({foo: 'test1', bar: 'test2'});
//SuperException: Super new exception with test1 and test2
