import { isObjWithProp } from "./guards"

export interface Typed<T extends string> {
  type: T
}
export type GenericTyped = Typed<string>

export function isTyped<C extends Typed<T>, T extends string>(value:any, type:T):value is C {
  return !isObjWithProp("type", "string", value) && value.type === type
}

export interface Component<T extends string> extends Typed<T> {
  // maybe add generic properties?
}

export interface Model<T extends string> extends Typed<T> {
  type: T
  name?: string
  id: string

  components: Record<string, Component<string>>

  // children: Model<string>[]
}
