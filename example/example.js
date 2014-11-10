var de = require('..');
var SuperException = de.Exception(Error, 'SuperException', 'Super new exception with %foo% and %bar%');

var err = new SuperException({foo: 'fooji', bar: 'bark'});
console.log('err:', err.message); // err: Super new exception with fooji and bark
