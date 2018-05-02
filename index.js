constraints = require('./constraints.json')

function format(string, options) {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string but got type: ' + typeof(number));
  }

  options = Object.assign({
    type: 'local',
    areaCode: '1',
    separator: '',
  }, options);

  if (!constraints[options['type']]) {
    throw new TypeError('Expected a valid type parameter but got type: ' + options['type']);
  }

  string = string.replace(/\D/g, '');

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

module.exports = format;
