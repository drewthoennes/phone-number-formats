constraints = require('./constraints.json')

function format(string, options) {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string and got type: ' + typeof(number));
  }

  options = Object.assign({
    type: 'local',
    areaCode: '1'
  }, options);

  if (!constraints[options['type']]) {
    throw new TypeError('Expected a valid type parameter');
  }

  string = string.replace(/\D/g, '');

  if (string.length < constraints[options['type']]) {
    throw new TypeError('Expected a sufficient number of numbers');
  }

  string = string.substring(string.length - constraints[options['type']]);

  if (options['type'] === 'local') {
    string = [string.substr(0, 3), '-', string.substring(3, string.length)].join('')
  } else if (options['type'] === 'domestic') {
    let areaCode = string.substr(string.length - constraints['domestic'], 3);
    string = ['(', areaCode, ') ', format(string.substring(string.length - constraints['domestic'], string.length), {type: 'local'})].join('');
  } else if (options['type'] === 'international') {
    string = ['+', options['areaCode'], ' ', format(string.substring(string.length - constraints['international'], string.length), {type: 'domestic'})].join('');
  }

  return string;
}

module.exports = format;
