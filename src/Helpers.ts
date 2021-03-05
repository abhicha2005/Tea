import {ItemsFormatter, SequenceItemLength} from "./Struct";

type Encoding = 'utf8' | 'latin1' | 'ascii';
type KeysMatching<T, P> = { [K in keyof T]: T[K] extends P ? K : never }[keyof T];

export type StringFormatterOptions = {encoding: Encoding|string, fatal?: boolean; ignoreBOM?: boolean}

export const BooleanFormatter = () : ItemsFormatter<number, boolean> => (data): boolean => Boolean(data[0]);

//todo: consider validation of number size for swap16/32 formatters
export const Swap16Formatter: ItemsFormatter<number, number[]> = (data) =>
    data.map(n => ((n & 0xff00) >>> 8) |
                  ((n & 0x00ff) << 8));

export const Swap32Formatter: ItemsFormatter<number, number[]> = (data) =>
    data.map(n => ((n & 0xFF000000) >>> 24) |
                  ((n & 0x00FF0000) >>> 8)  |
                  ((n & 0x0000FF00) << 8)   |
                  ((n & 0x000000FF) << 24));

/** static length helper **/
export const l = <C>(length: number): SequenceItemLength<C> =>
    (ignore) => length;
/** alias length helper **/
export const la = <C>(alias: KeysMatching<C, number>): SequenceItemLength<C> =>
    (res: C) => Number(res[alias]);
