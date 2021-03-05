import {ItemsFormatter, SequenceItemLength} from "./Struct";

type Encoding = 'utf8' | 'latin1' | 'ascii';
type KeysMatching<T, P> = { [K in keyof T]: T[K] extends P ? K : never }[keyof T];

export type StringFormatterOptions = {encoding: Encoding|string, fatal?: boolean; ignoreBOM?: boolean}

export const BooleanFormatter = () : ItemsFormatter<number, boolean> => (data): boolean => Boolean(data[0]);

const uswap16 = (uint16: number) => 0xFFFF & (
    ((uint16 & 0xff00) >> 8) |
    ((uint16 & 0x00ff) << 8));
const int16 = (int16: number) => (int16 << 16) >> 16;

const uswap32 = (n: number) => (0xFFFFFFFF & (//trim
        ((n & 0xFF000000) >>> 24) |//swap
        ((n & 0x00FF0000) >>> 8)  |
        ((n & 0x0000FF00) << 8)   |
        ((n & 0x000000FF) << 24)))
    >>> 0//hack to tell that it's unsigned
const int32 = (int32: number) => (int32 << 32) >> 32;

//todo: consider validation of number size for swap16/32 formatters
export const USwap16Formatter: ItemsFormatter<number, number[]> = (data) =>
    data.map(uswap16);

export const Swap16Formatter: ItemsFormatter<number, number[]> = (data) =>
    data.map(uswap16).map(int16);

export const USwap32Formatter: ItemsFormatter<number, number[]> = (data) =>
    data.map(uswap32);

export const Swap32Formatter: ItemsFormatter<number, number[]> = (data) =>
    data.map(uswap32).map(int32);


/** static length helper **/
export const l = <C>(length: number): SequenceItemLength<C> =>
    (ignore) => length;
/** alias length helper **/
export const la = <C>(alias: KeysMatching<C, number>): SequenceItemLength<C> =>
    (res: C) => Number(res[alias]);
