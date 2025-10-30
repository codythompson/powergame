import { Typed } from "./types/typed";

export type EventMap = {
  [k: string]: any
};

export interface Event<T extends string, A> extends Typed<T> {
  args: A
  category: string
}

export type Listener<E extends Event<T, A>, T extends string = string, A = any> = (event:E)=>void

export class Eventer<EM extends EventMap> {
  readonly listeners = {} as {
    [k in keyof EM]: Listener<Event<k&string, EM[k]>>[]
  };
  readonly genericListeners = [] as Listener<Event<keyof EM & string, EM[keyof EM]>>[]

  constructor(readonly category:string) {}

  emit<T extends keyof EM>(event:T, values:EM[T]):void {
    this.genericListeners.forEach(l => l(values));
    this.listeners[event].forEach(l => l(values));
  }

  register<T extends string & keyof EM>(type:T, listener:Listener<Event<T, EM[T]>>):number {
    if (!(type in this.listeners)) {
      this.listeners[type] = []
    }
    return this.listeners[type].push(listener) - 1;
  }

  registerGeneric(listener:Listener<Event<keyof EM & string, EM[keyof EM]>>) {
    this.genericListeners.push(listener);
  }
}
