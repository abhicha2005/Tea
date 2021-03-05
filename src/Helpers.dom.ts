import {ItemsFormatter} from "./Struct";
import {StringFormatterOptions} from "./Helpers";

export const StringFormatter = (options: TextDecoderOptions & StringFormatterOptions) : ItemsFormatter<number, string> => {
    const decoder = new TextDecoder(options.encoding, options);
    return (data: number[]): string => decoder.decode(new Int8Array(data), {stream: false});
}

export * from "./Helpers";
