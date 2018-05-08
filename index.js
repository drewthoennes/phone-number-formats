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

let types = {
  local: {
    key: 'XXX-XXXX',
    length: '7'
  },
  domestic: {
    key: '(XXX) XXX-XXXX',
    length: '10'
  },
  international: {
    key: '+YYY (XXX) XXX-XXXX',
    length: '11'
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
     throw new TypeError('Type of name `' + options['type'] + '` does not exist');
    }

    let key = types[options['type']]['key'];
    let keyLength = types[options['type']]['length'];

    if (options['letters']) {
      // Remove all but letters and numbers
      this.string = this.string.replace(/[^a-zA-Z0-9]/g, '');
    } else {
      // Remove all but numbers
      this.string = this.string.replace(/\D/g, '');
    }

    if (this.string.length < keyLength) {
      // Allows too-short numbers to be converted to international with an area code
      if (this.string.length + options['areaCode'].length < keyLength && options['type'] !== 'international') {
        throw new TypeError('Expected a sufficient number of numbers. Needed ' + keyLength + ' but got: ' + this.string.length);
      }
    }

    // Set string to the area code and the number minus the area code (assumes type is international)
    if (options['areaCode'] && options['type'] === 'international') {
      this.string = options['areaCode'] + this.string.substring(this.string.length - types['international']['length'] + 1);
    }

    let index;
    let X;
    let Y;
    let i;
    let newString = key;
    if (!options['areaCode']) {
      for (i = this.string.length - 1; i >= 0; i--) {
        if (!newString.includes('X') && !newString.includes('Y')) break;

        X = newString.lastIndexOf('X');
        Y = newString.lastIndexOf('Y');
        index = (X > Y) ? X : Y;
        newString = newString.substring(0, index) + this.string[i] + newString.substring(index + 1);
      }
    } else {
      for (i = this.string.length - 1; i >= 0; i--) {
        if (!newString.includes('X')) break;

        index = newString.lastIndexOf('X');
        newString = newString.substring(0, index) + this.string[i] + newString.substring(index + 1);
      }
      for (i = options['areaCode'].length - 1; i >= 0; i--) {
        if (!newString.includes('Y')) break;

        index = newString.lastIndexOf('Y');
        newString = newString.substring(0, index) + options['areaCode'][i] + newString.substring(index + 1);
      }
    }

    // Remove excess X's and Y's
    newString = newString.replace(/X|Y/g, '');
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
    let letter = '';
    for (var i = this.string.length - 1; i >= 0; i--) {
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

 module.exports.getType = function(name) {
   if (!types[name]) {
     throw new TypeError('Type of name `' + name + '` does not exist');
   }

   return (types[name]['key']);
 }
