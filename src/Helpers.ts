import {ItemsFormatter, SequenceItemLength} from "./Struct";

type Encoding = 'utf8' | 'latin1' | 'ascii';
type KeysMatching<T, P> = { [K in keyof T]: T[K] extends P ? K : never }[keyof T];

export type StringFormatterOptions = {encoding: Encoding|string, fatal?: boolean; ignoreBOM?: boolean}

export const BooleanFormatter = () : ItemsFormatter<number, boolean> => (data: number[]): boolean => !!data[0];

/** static length helper **/
export const l = <C>(length: number): SequenceItemLength<C> =>
    (ignore) => length;
/** alias length helper **/
export const la = <C>(alias: KeysMatching<C, number>): SequenceItemLength<C> =>
    (res: C) => Number(res[alias]);
