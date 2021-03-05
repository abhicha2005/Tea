import {Struct, Primitive, ItemsFormatter} from '../src/Struct'
import {StringFormatter, la, l, Swap16Formatter, Swap32Formatter} from '../src/Helpers.node'
import {readFileSync} from 'fs';
import {TextDecoder} from 'util';

describe('Test struct', () => {

    const utf8String = '—simple utf-8©іѳ≈˚§€²³$‰←∞\0';
    const encryptedFile = readFileSync(`${__dirname}/resources/471-strings.dat`);
    const [Byte, Char] = [Primitive.UInt8(), Primitive.Int8()];

    it('read null terminated string', () => {
        let buffer = Buffer.alloc(150, 254);

        let bytesWritten = buffer.write(utf8String);
        let data = new DataView(buffer.buffer);

        let txtStruct = new Struct<{eol: number, text: string}>()
            .offsetOf('eol', Primitive.Int8(), (n) => n === 0)
            .goto(la('eol'))
            .goto(l(0))
            .array('text', Char, la('eol'), StringFormatter());

        let res = txtStruct.unpack(data);
        expect(res.eol).toBe(bytesWritten-1);
        expect(res.text).toBe("—simple utf-8©іѳ≈˚§€²³$‰←∞");
    });

    it('read encrypted file', () =>  {
        let PascalDecryptFormatter = (key: number[]): ItemsFormatter<number, string> => (data) => {
            for (let i = data.length-1, l = key.length; i >= 0; --i) {
                data[i] ^= key[i%l];
                data[i] ^= data[i-1];
            }
            return new TextDecoder('ascii').decode(new Int8Array(data), {stream: false});
        }

        interface TextChunk {
            length: number,
            data: string
        }

        let textStruct = new Struct<{strings: TextChunk[]}>()
            .array('strings', new Struct<TextChunk>()
                .single('length', Byte)
                .array('data', Char, la('length'), PascalDecryptFormatter([204, 129, 63, 255, 71, 19, 25, 62, 1, 99])),
                Struct.all)

        let {strings} = textStruct.unpack(new DataView(encryptedFile.buffer));

        expect(strings.length).toBe(471);
        let content = strings.map(({data}) => data).join('');
        expect(content).toContain(']?[ 04 010 011 013 017   (No cubes)');
    })

    it('test swap16 formatter', () => {
        let buffer = Buffer.alloc(2, 0);
        buffer.writeUInt16LE(3000, 0);

        let swap16 = new Struct<{swap: number[]}>().array('swap', Primitive.UInt16LE(), Struct.one, Swap16Formatter);

        let {swap: [swapped]} = swap16.unpack(new DataView(buffer.buffer));

        buffer.swap16();
        expect(swapped).toBe(buffer.readUInt16LE(0));
    });

    it('test swap32 formatter', () => {
        let buffer = Buffer.alloc(4, 0);
        buffer.writeInt32LE(5051, 0);

        let swap32 = new Struct<{swap: number[]}>().array('swap', Primitive.Int32LE(), Struct.one, Swap32Formatter);

        let {swap: [swapped]} = swap32.unpack(new DataView(buffer.buffer));

        buffer.swap32();
        expect(swapped).toBe(buffer.readInt32LE(0));
    });

});
