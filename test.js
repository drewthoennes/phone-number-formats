const assert = require('assert');
const phoneNumberFormatter = require('./index.js');

console.log('--- Testing ---');

let number = new phoneNumberFormatter('1234567').format();
assert.deepEqual(number.toString(), '123-4567');

number = new phoneNumberFormatter('1234567890').format();
assert.deepEqual(number.toString(), '456-7890');

number = new phoneNumberFormatter('1234567890').format({type: 'domestic'});
assert.deepEqual(number.toString(), '(123) 456-7890');

number = new phoneNumberFormatter('01234567890').format({type: 'international'});
assert.deepEqual(number.toString(), '+0 (123) 456-7890');

number = new phoneNumberFormatter('+0 (123) 456-7890').format({type: 'local'});
assert.deepEqual(number.toString(), '456-7890');

number = new phoneNumberFormatter('+21 (123) 456-7890').format({type: 'international', areaCode: '3'});
assert.deepEqual(number.toString(), '+3 (123) 456-7890');

number = new phoneNumberFormatter('2305466328210').format({type: 'international', areaCode: '230', separator: '.'})
assert.deepEqual(number.toString(), '+230.546.632.8210');

number = new phoneNumberFormatter('1800765BTFU').format({type: 'international'}).convert();
assert.deepEqual(number.toString(), '+1 (800) 765-2838');

console.log('All test cases passed');
