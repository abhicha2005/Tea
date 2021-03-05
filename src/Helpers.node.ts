import {ItemsFormatter} from "./Struct";
import {TextDecoder} from 'util'
import {StringFormatterOptions} from "./Helpers";

export const StringFormatter = (options: StringFormatterOptions = {encoding: 'utf8', fatal: true, ignoreBOM: false}) : ItemsFormatter<number, string> => {
    const decoder = new TextDecoder(options.encoding, options);
    return (data: number[]): string => decoder.decode(new Int8Array(data), {stream: false})
}

export * from "./Helpers";
