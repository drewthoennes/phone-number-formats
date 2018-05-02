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
```


## API

### phoneNumberFormatter(number, [options])
Return: `string`

#### number
Type: `string`

#### options
Type: `object`

##### type
Type: `string`
Default: `local`
Accepted: [`local`|`domestic`|`international`]

##### areaCode
Type: `string`
Default: `1`
Accepted: `*`

##### separator
Type: `string`
Default: ``
Accepted: `*`

## License

[MIT](https://github.com/drewthoennes/phone-number-formatter/blob/master/license)
