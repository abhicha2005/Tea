# struct [![CI](https://github.com/ololoken/struct/actions/workflows/main.yml/badge.svg)](https://github.com/ololoken/struct/actions/workflows/main.yml) [![npm version](https://badge.fury.io/js/@ololoken%2fstruct.svg)](https://badge.fury.io/js/@ololoken%2fstruct)

A binary data unpacking library written in typescript. Support both node and dom.

What can it do?
---------------

* Read: 
    * primitives: Int8| UInt8 | Int16BE | Int16LE | UInt16BE | UInt16LE | Int32BE | Int32LE | UInt32BE | UInt32LE,
    * large numbers: BigInt64BE | BigInt64LE | BigUInt64BE | BigUInt64LE,
    * fractional numbers: DoubleBE | DoubleLE | FloatBE | FloatLE;
* Handle booleans and strings with built-in helpers;
* Search offset in binary data;
* Fully customizable data structures with ts types hinting;

Usage
-----
```typescript
interface TextChunk {
    length: number,
    data: string
}
const [Byte, Char] = [Primitive.UInt8(), Primitive.Int8()];//define our own types
//a string of specified length
let chunkStruct = new Struct<TextChunk>()
        .single('length', Byte)//first byte represents length
        .array('data', Char, /*alias helper*/la('length'), StringFormatter({encoding: 'ascii'}))//read following string

let textStruct = new Struct<{strings: TextChunk[]}>()
    .array('strings', chunkStruct, /*read buffer to the end*/Struct.all)//read array of chunks

let {strings} = textStruct.unpack(textDataView);
console.log(strings);
/* 
expected output:
[
      {
        length: 78,
        data: '**1 SECTION - LEVEL #1****This has not been encrypted in case of changes******'
      },
      { length: 7, data: ']J 002[' },
      { length: 0, data: '' },
      .....
]
*/
```
See more examples in spec. 

