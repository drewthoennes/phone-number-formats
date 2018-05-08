const assert = require('assert');
const phoneNumberFormatter = require('./index.js');

console.log('--- Testing ---');

// Default formatting
let number = new phoneNumberFormatter('1234567').format();
assert.deepEqual(number.toString(), '123-4567');

// Excluding extra characters
number = new phoneNumberFormatter('1234567890').format();
assert.deepEqual(number.toString(), '456-7890');

// Ignoring letters
number = new phoneNumberFormatter('My phone number is: "123.4567"').format({letters: false});
assert.deepEqual(number.toString(), '123-4567');

// Checking `local` type
number = new phoneNumberFormatter('+0 (123) 456-7890').format({type: 'local'});
assert.deepEqual(number.toString(), '456-7890');

// Checking `domestic` type
number = new phoneNumberFormatter('1234567890').format({type: 'domestic'});
assert.deepEqual(number.toString(), '(123) 456-7890');

// Checking `international` type
number = new phoneNumberFormatter('01234567890').format({type: 'international'});
assert.deepEqual(number.toString(), '+0 (123) 456-7890');

// Checking if normally-short numbers can be formatted to `international` with the correct area code
number = new phoneNumberFormatter('1234567890').format({type: 'international', areaCode: '3'});
assert.deepEqual(number.toString(), '+3 (123) 456-7890');

// Checking if `international` numbers with area codes exclude extra characters
number = new phoneNumberFormatter('1.618033988749894').format({type: 'international', areaCode: '0'});
assert.deepEqual(number.toString(), '+0 (398) 874-9894');

// Checking area codes on international numbers
number = new phoneNumberFormatter('+21 (123) 456-7890').format({type: 'international', areaCode: '3'});
assert.deepEqual(number.toString(), '+3 (123) 456-7890');

// Checking separators
number = new phoneNumberFormatter('2305466328210').format({type: 'international', areaCode: '230', separator: '.'})
assert.deepEqual(number.toString(), '+230.546.632.8210');

// Checking letter conversion
number = new phoneNumberFormatter('1800765BTFU').format({type: 'international'}).convert();
assert.deepEqual(number.toString(), '+1 (800) 765-2838');

// Checking conversion of completely lettered numbers
number = new phoneNumberFormatter('HiThere').format().convert();
assert.deepEqual(number.toString(), '448-4373');

// Adding new type and converting
phoneNumberFormatter.addType('china', '0 +591 XXX-XXX');
number = new phoneNumberFormatter('675309').format({type: 'china'});
assert.deepEqual(number.toString(), '0 +591 675-309');

// Checking custom type with arguments
phoneNumberFormatter.addType('kyrgyzstan', '0XXX XXX-XXX');
number = new phoneNumberFormatter('0101010101').format({type: 'kyrgyzstan', separator: '.'});
assert.deepEqual(number.toString(), '0101.010.101');

// Checking custom type with letters
phoneNumberFormatter.addType('helloWorld', 'XXXXX XXXXX');
number = new phoneNumberFormatter('Hello World').format({type: 'helloWorld', separator: '_'});
assert.deepEqual(number.toString(), 'Hello_World');

console.log('All test cases passed');
