const assert = require('assert');
const phoneNumberFormatter = require('./index.js');

console.log('--- Testing ---');

assert.deepEqual(phoneNumberFormatter('1234567'), '123-4567');
assert.deepEqual(phoneNumberFormatter('1234567890'), '456-7890');
assert.deepEqual(phoneNumberFormatter('1234567890', {type: 'domestic'}), '(123) 456-7890');
assert.deepEqual(phoneNumberFormatter('01234567890', {type: 'international'}), '+1 (123) 456-7890');
assert.deepEqual(phoneNumberFormatter('+0 (123) 456-7890', {type: 'local'}), '456-7890');
assert.deepEqual(phoneNumberFormatter('+21 (123) 456-7890', {type: 'international', areaCode: '3'}), '+3 (123) 456-7890');
assert.deepEqual(phoneNumberFormatter('2305466328210', {type: 'international', areaCode: '230', separator: '.'}), '+230.546.632.8210');

console.log('All test cases passed');
