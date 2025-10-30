// command is action definition / logic to execute against set of entities
// action is command + set of entities / command args
// event is issued from a system, listener, collection, game, anything - has affected entities
// system creates actions when event is issued

import { Entity, EntityCollection, TEntity } from "./entity";
import { isDef } from "./types/guards";
import { Tracked, Typed } from "./types/typed";

export class System {
  constructor(readonly collection:EntityCollection) {
    collection.eventer.registerGeneric(e => this.emit(e.type, ))
  }

  readonly actions:{ [E:string]: Action<typeof E, TEntity>[] } = {};

  on<ET extends string, E extends TEntity>(action:Action<ET,E>):void {
    if (!(action.event in this.actions)) {
      this.actions[action.event] = []
    }
    this.actions[action.event].push(action);
  }

  emit(event:string, affected:Entity[]):any[] {
    let actions = this.getActionsFor(event);
    return actions.map(a => this.do(a, affected));
  }

  createEvent<ET extends string = string, E extends TEntity = TEntity>(action:Action<ET,E>, affected:Entity[]):Event<ET,E> {
    const entities = action.query({collection: this.collection, affected});
    return {
      type: action.event,
      issuer: this,
      entities,
    }
  }

  do<ET extends string = string, E extends TEntity = TEntity, R = void>(action:Action<ET,E,R>, affected:Entity[]):R {
    return action.command.execute(this.createEvent(action, affected));
  }

  getActionsFor<ET extends string = string, E extends TEntity = TEntity>(event:ET):Action<ET,E>[] {
    return this.actions[event] as Action<ET,E>[] ?? [];
  }
}

export interface Action<ET extends string, E extends TEntity, R = void> {
  event: ET
  query: Query<E>
  command: Command<E,R>
}

export interface Event<T extends string, E extends TEntity> extends Typed<T> {
  issuer: System;// ?
  entities: E[];
}

export interface Command<E extends TEntity, R = void> {
  execute<ET extends string = string>(initiator:Event<ET,E>):R
}

export interface QueryParams {
  collection: EntityCollection
  affected: Entity[]
}
export type Query<E extends Tracked<Entity>> = (args:QueryParams) => E[]

function toPropertyMap(property:keyof Entity, entities:Entity[]):Record<string|number,Entity> {
  const keyValues = entities.map(e => [e[property],e]);
  return Object.fromEntries(keyValues);
}
export function QById<E extends TEntity>(...id:number[]):Query<E> {
  return ({affected}) => {
    const idMap = toPropertyMap("id", affected);
    return id.map(id => idMap[id] as E | undefined)
      .filter(e => isDef(e))
  }
}

export function QByName<E extends TEntity>(...name:string[]):Query<E> {
  return ({affected}) => {
    const idMap = toPropertyMap("name", affected);
    return name.map(id => idMap[id] as E | undefined)
      .filter(e => isDef(e))
  }
}
