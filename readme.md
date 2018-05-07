# Phone Number Formatter

This package can help format numbers into formal phone numbers or translate phone numbers into other formats

## Install

```bash
$ npm install phone-number-formatter
```

## Usage

```js
const phoneNumberFormatter = require('phone-number-formatter');

phoneNumberFormatter('1234567')
// 123-4567

phoneNumberFormatter('3-141-592-6535', {type: 'domestic'})
// (141) 592-6535

phoneNumberFormatter('18008675309', {type: 'international', separator: '.'})
// +1.800.867.5309

phoneNumberFormatter('+1 (800) 271-8281', {type: 'international', areaCode: '996'})
// +996 (800) 271-8281
```


## API

### phoneNumberFormatter(number, [options])
Return: `string`

#### number
Type: `string`

#### options
Type: `object`

##### type
Type: `string`<br>
Default: `local`<br>
Accepted: [`local`|`domestic`|`international`]

##### areaCode
Type: `string`<br>
Default: `1`<br>
Accepted: `*`

##### separator
Type: `string`<br>
Default: ` `<br>
Accepted: `*`

#### letters
Type: `boolean`<br>
Default: `true`<br>

## License

[MIT](https://github.com/drewthoennes/phone-number-formatter/blob/master/license)
