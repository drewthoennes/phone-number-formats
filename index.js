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
      areaCode: (this.string.length >= constants['international']) ? this.string.substring(0, this.string.length - constants['international'] + 1) : '1',
      separator: '',
      letters: true
    }, options);

    if (!constants[options['type']]) {
      throw new TypeError('Expected a valid type parameter but got type: ' + options['type']);
    }

    if (options['letters']) {
      this.string = this.string.replace(/[^a-zA-Z0-9]/g, '');
    } else {
      this.string = this.string.replace(/\D/g, '');
    }

    if (this.string.length < constants[options['type']]) {
      throw new TypeError('Expected a sufficient number of numbers. Needed ' + constants[options['type']] + ' but got: ' + this.string.length);
    }

    this.string = this.string.substring(this.string.length - constants[options['type']]);

    if (options['type'] === 'local') {
      this.string = [this.string.substr(0, 3), this.string.substring(3)].join('-');
    } else if (options['type'] === 'domestic') {
      let areaCode = this.string.substr(this.string.length - constants['domestic'], 3);
      this.string = ['(' + areaCode + ')', this.format({type: 'local'})].join(' ');
    } else if (options['type'] === 'international') {
      this.string = ['+' + options['areaCode'], this.format({type: 'domestic'})].join(' ');
    }

    if (options['separator']) {
      this.string = this.string.replace(/[()]/g, '');
      this.string = this.string.replace(/[^0-9+()]/g, options['separator']);
    }

    return this;
  }

  convert() {
    if (this.string.length < constants['convertMin']) {
      throw new TypeError('Expected a sufficient number of numbers. Needed ' + options['convertMin'] + ' but got: ' + this.string.length);
    }

    let letter = '';
    for (var i = this.string.length - 1; i >= this.string.length - constants['convertLength']; i--) {
      this.string = this.string.substring(0, i) + privateMethods.convertSingleChar(this.string[i]) + this.string.substring(i + 1);
    }

    return this;
  }

  toString() {
    return this.string;
  }
}
