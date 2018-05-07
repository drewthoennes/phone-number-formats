constraints = require('./constraints.json')

function format(string, options) {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string but got type: ' + typeof(number));
  }

  options = Object.assign({
    type: 'local',
    areaCode: '1',
    separator: '',
    letters: true
  }, options);

  if (!constraints[options['type']]) {
    throw new TypeError('Expected a valid type parameter but got type: ' + options['type']);
  }

  if (options['letters']) {
    string = string.replace(/[^a-zA-Z0-9]/g, '');
  } else {
    string = string.replace(/\D/g, '');
  }

  if (string.length < constraints[options['type']]) {
    throw new TypeError('Expected a sufficient number of numbers. Needed ' + constraints[options['type']] + ' but got: ' + string.length);
  }

  string = string.substring(string.length - constraints[options['type']]);

  if (options['type'] === 'local') {
    string = [string.substr(0, 3), string.substring(3)].join('-');
  } else if (options['type'] === 'domestic') {
    let areaCode = string.substr(string.length - constraints['domestic'], 3);
    string = ['(' + areaCode + ')', format(string.substring(string.length - constraints['domestic']), {type: 'local'})].join(' ');
  } else if (options['type'] === 'international') {
    string = ['+' + options['areaCode'], format(string.substring(string.length - constraints['international']), {type: 'domestic'})].join(' ');
  }

  if (options['separator']) {
    string = string.replace(/[()]/g, '');
    string = string.replace(/[^0-9+()]/g, options['separator']);
  }

  return string;
}

function convert(string, options) {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string but got type: ' + typeof(number));
  }

  options = Object.assign({
    convertMin: constraints['convertMin'],
    convertLength: 4
  }, options);

  if (string.length < options['convertMin']) {
    throw new TypeError('Expected a sufficient number of numbers. Needed ' + options['convertMin'] + ' but got: ' + string.length);
  }

  let letter = '';
  for (var i = string.length - 1; i >= string.length - options['convertLength']; i--) {
    string[i] = convertSingleChar(string[i]);
  }

  return string;
}

function convertSingleChar(char) {
  const keyboard = {
    2: ['a', 'b', 'c'],
    3: ['d', 'e', 'f'],
    4: ['g', 'h', 'i'],
    5: ['j', 'k', 'l'],
    6: ['m', 'n', 'o'],
    7: ['p', 'q', 'r', 's'],
    8: ['t', 'u', 'v'],
    9: ['w', 'x', 'y', 'z']
  }

  let value = char;

  Object.keys(keyboard).forEach(function(key) {
    if (keyboard[key].includes(String(char).toLowerCase())) {
      value = key;
    }
  });

  return value;
}

module.exports = format;
module.exports.convert = convert;
