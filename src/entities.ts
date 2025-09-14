import { Container, Sprite } from "pixi.js"
import { isDef, isNum, isObj } from "./types/guards"
import { Tracked, Typed } from "./types/typed"

export interface Entity<T extends string = string, C extends Typed<string> = Typed<string>> extends Typed<T> {
  id?: number
  name: string

  parent?: number
  connected?: number

  components: Record<string,C>
}

export type PixiSprite = Sprite|Container

export class Node<E extends Tracked<Entity>> {
  constructor(readonly collection: EntityCollection, readonly entity:E) {}

  get name():string {
    return this.entity.name;
  }

  get id():number {
    return this.entity.id;
  }

  get components():E["components"] {
    return this.entity.components;
  }

  get sprites():Record<string,PixiSprite> {
    return this.collection.getSprites(this.id);
  }

  getSprite(name:string):PixiSprite|undefined {
    return this.sprites[name];
  }

  get parent():Entity|undefined {
    return this.collection.get(this.entity.parent);
  }

  get connected():Entity|undefined {
    return this.collection.get(this.entity.connected);
  }

  toParent():Node<Tracked<Entity>>|undefined {
    return this.collection.getNode(this.entity.parent);
  }

  toConnected():Node<Tracked<Entity>>|undefined {
    return this.collection.getNode(this.entity.connected);
  }

  connect(entity:Entity|number):Node<E> {
    this.collection.connect(this.id, entity);
    return this;
  }

  setSprite(name:string, sprite:PixiSprite):Node<E> {
    this.collection.setSprite(this.id, name, sprite);
    return this;
  }
}

export interface EntityPushParams<E extends Entity, C extends Entity = Entity> {
  entity: E
  sprites: Record<string, PixiSprite>
  children?: EntityPushParams<C>
}

export class EntityCollection {
  private _entities: Entity[] = [];
  private _sprites: Record<number, Record<string,PixiSprite>> = {};
  private _byParentId: Record<number, Tracked<Entity>[]> = {};
  private _nodeCache: Record<number, Node<Tracked<Entity>>> = {};

  push(entity:Entity):number {
    if (isDef(entity.id)) {
      throw Error();
    }
    const id = this._entities.push(entity)-1;
    entity.id = id;
    if (isDef(entity.parent)) {
      if (!(entity.parent in this._byParentId)) {
        this._byParentId[entity.parent] = [];
      }
      this._byParentId[entity.parent].push(entity as Tracked<Entity>)
    }
    return id;
  }

  pushTree({entity,sprites,children}:EntityPushParams<Entity>):number {
    const id = this.push(entity);
    this._sprites[id] = sprites;
    if (isDef(children)) {
      this.pushTree(children);
    }
    return id;
  }

  get<E extends Entity = Entity>(id:number|undefined):Tracked<E>|undefined {
    if (!isDef(id)) {
      return undefined;
    }
    return this._entities[id] as Tracked<E>|undefined
  }

  getNode<E extends Entity = Entity>(id:number|undefined):Node<Tracked<E>>|undefined {
    if (isDef(id) && id in this._nodeCache) {
      return this._nodeCache[id] as Node<Tracked<E>>;
    }
    const e = this.get<E>(id);
    if (!isDef(e)) {
      return undefined
    }
    const node = new Node<Tracked<E>>(this, e);
    this._nodeCache[id!] = node;
    return node;
  }

  getSprites(entity:Entity|number):Record<string,PixiSprite> {
    const id = this.assert(entity).id;
    if (!(id in this._entities)) {
      throw new Error(`${id} not in this collection`);
    }
    if (!(id in this._sprites)) {
      // mutating inside getter! is super convenient
      this._sprites[id] = {};
    }
    return this._sprites[id];
  }

  assert<E extends Entity = Entity>(e:number|Entity|undefined):Tracked<E> {
    if (isObj(e)) {
      if (!isNum(e.id) || !(e.id in this._entities)) {
        throw new Error("e not in this");
      }
      return e as Tracked<E>;
    }
    return this.assert(this.get(e));
  }

  setParent(entity:Entity, newParent:number|undefined):void {
    const e = this.assert(entity);
    if (isNum(newParent) && !isDef(this.get(newParent))) {
      throw new Error("setparent unknown parent");
    }
    e.parent = newParent;
  }

  connect(a:Entity|number, b:Entity|number) {
    const aE = this.assert(a);
    const bE = this.assert(b);
    aE.connected = bE.id;
    bE.connected = aE.id;
  }

  setSprite(forEntity:Entity|number, spriteName:string, sprite:PixiSprite):void {
    this.getSprites(forEntity)[spriteName] = sprite;
  }
}
