import { isObjWithProp } from "./guards";

export interface Typed<T extends string> {
  readonly type: T;
}
export type GenericTyped = Typed<string>;

export type UnTyped<O extends GenericTyped> = Omit<O, "type">;

export function isTyped<C extends Typed<T>, T extends string>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  type: T,
): value is C {
  return !isObjWithProp("type", "string", value) && value.type === type;
}

export type TOf<O extends Typed<string>> = O["type"];

// export function enumish<K extends string>(...keys:K[]):Enumish<K> {
//     return Object.fromEntries(keys.map(k => [k,k])) as Record<K,K>
// }
// export type Enumish<K extends string> = Record<K,K>;
// export function enumerate<K extends string>(enumish:Enumish<K>):K[] {
//     return Object.values(enumish)
// }
// export function isEnumishGuard<K extends string>(enumish:Enumish<K>):(value:string) => value is keyof Enumish<K> {
//     return (value:string):value is K => enumerate(enumish).indexOf(value as K) >= 0
// }
// export type EnumishK<E extends Enumish<string>, K extends keyof E> = E[K]

export type Tracked<T extends { id?: number }> = T & { id: number };
export type UnTracked<T extends object> = T & { id: undefined };
