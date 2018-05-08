const constants = require('./constants.json')
const privateMethods = {
  convertSingleChar(char) {
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
}
const convertMin = 7;
const convertLength = 4;

let types = {
  'local': {
    'key': 'XXX-XXXX',
    'length': '7'
  },
  'domestic': {
    'key': '(XXX) XXX-XXXX',
    'length': '10'
  },
  'international': {
    'key': '+XXX (XXX) XXX-XXXX',
    'length': '11'
  }
}

module.exports = class phoneNumberFormatter {
  constructor(string) {
    if (typeof string !== 'string') {
      throw new TypeError('Expected a string but got type: ' + typeof(number));
    }
    this.string = string;
  }

  format(options) {
    options = Object.assign({
      type: 'local',
      areaCode: '',
      separator: '',
      letters: true
    }, options);

    // Check if type exists
    if (!types[options['type']]) {
      throw new TypeError('Expected a valid type parameter but got type: ' + options['type']);
    }

    let key = types[options['type']]['key'];
    let keyLength = types[options['type']]['length'];

    if (options['letters']) {
      this.string = this.string.replace(/[^a-zA-Z0-9]/g, '');
    } else {
      this.string = this.string.replace(/\D/g, '');
    }

    if (this.string.length < keyLength) {
      throw new TypeError('Expected a sufficient number of numbers. Needed ' + keyLength + ' but got: ' + this.string.length);
    }

    // Set string to the area code and the number minus the area code (assumes type is international)
    if (options['areaCode'] && options['type'] === 'international') {
      this.string = options['areaCode'] + this.string.substring(this.string.length - types['international']['length'] + 1);
    }

    let index;
    let newString = key;
    for (var i = this.string.length - 1; i >= 0; i--) {
      if (!newString.includes('X')) break;

      index = newString.lastIndexOf('X');
      newString = newString.substring(0, index) + this.string[i] + newString.substring(index + 1);
    }

    // Remove excess X's
    newString = newString.replace(/X/g, '');
    this.string = newString;

    // If a separator, remove and replace non-numeric characters
    if (options['separator']) {
      this.string = this.string.replace(/[()]/g, '');
      // If letters are allowed, don't remove them
      if (options['letters']) {
        this.string = this.string.replace(/[^a-zA-Z0-9+]/g, options['separator']);
      } else {
        this.string = this.string.replace(/[^0-9+]/g, options['separator']);
      }
    }

    return this;
  }

  convert() {
    if (this.string.length < convertMin) {
      throw new TypeError('Expected a sufficient number of numbers. Needed ' + convertMin + ' but got: ' + this.string.length);
    }

    let letter = '';
    for (var i = this.string.length - 1; i >= this.string.length - convertLength; i--) {
      this.string = this.string.substring(0, i) + privateMethods.convertSingleChar(this.string[i]) + this.string.substring(i + 1);
    }

    return this;
  }

  toString() {
    return this.string;
  }
}

module.exports.addType = function(name, string) {
  types[name] = {};
  types[name]['key'] = string;
  types[name]['length'] = string.replace(/[^0-9]/g, '').length;
  return true;
}
