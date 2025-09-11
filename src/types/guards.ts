import { NullNotAllowedError, UnexpectedUndefinedError } from "./errors"

export type Prim = string|number|boolean
export type Simple = undefined|Prim|Simple[]|{[ix:string]:Simple}

export type PrimMap = {
  string:string,
  number:number,
  boolean:boolean
}
export const RuntimePrimMap:Record<keyof PrimMap,keyof PrimMap> = {
  string:"string",
  number:"number",
  boolean:"boolean"
}

export type PrimType = keyof PrimMap

export function assertNotNull<T>(value:T|null):value is T {
  if (value === null) {
    throw new NullNotAllowedError() // TODO message
  }
  return true
}

export function assertDef<T extends Prim|object>(value:T|null|undefined, message?:string):T {
  if (!isDef(value)) {
    throw new UnexpectedUndefinedError(message);
  }
  return value
}

export function isDef<T>(value:T|undefined|null):value is T {
  assertNotNull(value)
  return value !== undefined
}

export function isArr(value:any):value is any[] {
  assertNotNull(value)
  return Array.isArray(value)
}

export function isObj<T extends Record<string,any> = Record<string,any>>(value:any):value is T {
  return typeof value === "object" && !isArr(value)
}

export function isFunc(value:any):value is Function {
  return typeof value === "function"
}

export function isPrim(value:any):value is Prim {
  assertNotNull(value)
  return typeof value in RuntimePrimMap
}

export function isPrimOfType(type:PrimType, value:any):value is PrimMap[typeof type] {
  return isPrim(value) && typeof value === RuntimePrimMap[type]
}

export function isStr(value:any):value is string {
  return isPrimOfType(RuntimePrimMap.string, value)
}

export function isNum(value:any):value is number {
  return isPrimOfType(RuntimePrimMap.number, value)
}

export function isBool(value:any):value is boolean {
  return isPrimOfType(RuntimePrimMap.boolean, value)
}

export type TypeGuard<T> = (value:any)=>value is T
export type TypeDef<T> = TypeGuard<T>|PrimType
export type OptionalPropDef<P> = TypeDef<P>|{typeDef:TypeDef<P>,optional:boolean}

export function isOfTypeDef<T>(typeDef:OptionalPropDef<T>, value:any):value is T {
  if (isFunc(typeDef)) {
    return typeDef(value)
  }
  if (isStr(typeDef)) {
    return isPrimOfType(typeDef, value)
  }
  if (isObj(typeDef)) {
    const {typeDef:optTypeDef, optional} = typeDef
    if (optional && !isDef(value)) {
      return true
    }
    return isOfTypeDef(optTypeDef,value)
  }
  throw Error(`Unexpected typedef guard type ${typeof typeDef}`)
}

export function isObjWithProp<P>(property:string, propTypeGuard:TypeDef<P>, value:any):value is {[property]:P} {
  return isObj(value) &&
    property in value &&
    isOfTypeDef(propTypeGuard, value[property])
}

export function isObjWithOptionalProp<P>(property:string, propTypeGuard:TypeDef<P>, value:any):value is {[property]?:P} {
  if (!isObj(value)) {
    return false
  }
  return isOfTypeDef({typeDef:propTypeGuard, optional:true}, value[property])
}

export function isObjWithProps<O>(requiredPropDefs:Record<string,OptionalPropDef<any>>, value:any):value is O {
  if (!isObj(value)) {
    return false
  }
  for (let [prop,def] of Object.entries(requiredPropDefs)) {
    if (!isOfTypeDef(def, value[prop])) {
      return false
    }
  }
  return true
}
