import { Container, Sprite } from "pixi.js";
import { isDef, isNum, isObj } from "./types/guards";
import { Tracked, Typed } from "./types/typed";

export interface Entity<
  T extends string = string,
  C extends Typed<string> = Typed<string>,
> extends Typed<T> {
  id?: number;
  name: string;

  parent?: number;
  connected?: number;

  components: Record<string, C>;
}

export type PixiSprite = Sprite | Container;

export class Node<E extends Tracked<Entity>> {
  constructor(
    readonly collection: EntityCollection,
    readonly entity: E,
  ) {}

  get name(): string {
    return this.entity.name;
  }

  get id(): number {
    return this.entity.id;
  }

  get components(): E["components"] {
    return this.entity.components;
  }

  get sprite(): PixiSprite | undefined {
    return this.collection.getSprite(this.id);
  }

  get parent(): Entity | undefined {
    return this.collection.get(this.entity.parent);
  }

  get connected(): Entity | undefined {
    return this.collection.get(this.entity.connected);
  }

  toParent(): Node<Tracked<Entity>> | undefined {
    return this.collection.getNode(this.entity.parent);
  }

  toConnected(): Node<Tracked<Entity>> | undefined {
    return this.collection.getNode(this.entity.connected);
  }

  connect(entity: Entity | number): Node<E> {
    this.collection.connect(this.id, entity);
    return this;
  }

  setSprite(sprite: PixiSprite): Node<E> {
    this.collection.setSprite(this.id, sprite);
    return this;
  }
}

export interface EntityPushParams<E extends Entity, C extends Entity = Entity> {
  entity: E;
  sprite?: PixiSprite;
  children?: EntityPushParams<C>[];
}

export class EntityCollection {
  private _entities: Entity[] = [];
  private _sprites: Record<number, PixiSprite> = {};
  private _byParentId: Record<number, Tracked<Entity>[]> = {};
  private _nodeCache: Record<number, Node<Tracked<Entity>>> = {};

  constructor(readonly container: Container) {}

  push(entity: Entity): number {
    if (isDef(entity.id)) {
      throw Error();
    }
    const id = this._entities.push(entity) - 1;
    entity.id = id;
    if (isDef(entity.parent)) {
      if (!(entity.parent in this._byParentId)) {
        this._byParentId[entity.parent] = [];
      }
      this._byParentId[entity.parent].push(entity as Tracked<Entity>);
    }
    return id;
  }

  pushTree(params: EntityPushParams<Entity>): number {
    const { entity, sprite, children = [] } = params;
    const id = this.push(entity);
    if (isDef(sprite)) {
      this._sprites[id] = sprite;
      this.container.addChild(sprite);
    }
    for (const child of children) {
      const childId = this.pushTree(child);
      this.setParent(this.get(childId)!, id);
    }
    return id;
  }

  get<E extends Entity = Entity>(
    id: number | undefined,
  ): Tracked<E> | undefined {
    if (!isDef(id)) {
      return undefined;
    }
    return this._entities[id] as Tracked<E> | undefined;
  }

  getNode<E extends Entity = Entity>(
    id: number | undefined,
  ): Node<Tracked<E>> | undefined {
    if (isDef(id) && id in this._nodeCache) {
      return this._nodeCache[id] as Node<Tracked<E>>;
    }
    const e = this.get<E>(id);
    if (!isDef(e)) {
      return undefined;
    }
    const node = new Node<Tracked<E>>(this, e);
    this._nodeCache[id!] = node;
    return node;
  }

  getSprite(entity: Entity | number): PixiSprite | undefined {
    const id = this.assert(entity).id;
    if (!(id in this._entities)) {
      throw new Error(`${id} not in this collection`);
    }
    return this._sprites[id];
  }

  assert<E extends Entity = Entity>(
    e: number | Entity | undefined,
  ): Tracked<E> {
    if (isObj(e)) {
      if (!isNum(e.id) || !(e.id in this._entities)) {
        throw new Error("e not in this");
      }
      return e as Tracked<E>;
    }
    return this.assert(this.get(e));
  }

  setParent(entity: Entity, newParent: number | undefined): void {
    const e = this.assert(entity);
    if (isNum(newParent) && !isDef(this.get(newParent))) {
      throw new Error("setparent unknown parent");
    }
    e.parent = newParent;
    const sprite = this.getSprite(e);

    // re-parent the sprite to first ancestor
    if (!isDef(sprite)) {
      return;
    }
    sprite.removeFromParent();
    let spriteParent = this.getNode(newParent);
    let container: PixiSprite | undefined = undefined;
    while (isDef(spriteParent)) {
      // find the first ancestor with a defined sprite
      container = spriteParent.sprite;
      spriteParent = isDef(container) ? undefined : spriteParent.toParent();
    }
    // add the sprite as a child of either the ancestor sprite we found,
    // or the base container if not found
    (container ?? this.container).addChild(sprite);
  }

  connect(a: Entity | number, b: Entity | number) {
    const aE = this.assert(a);
    const bE = this.assert(b);
    aE.connected = bE.id;
    bE.connected = aE.id;
  }

  setSprite(forEntity: Entity | number, sprite: PixiSprite): void {
    const e = this.assert(forEntity);
    this._sprites[e.id] = sprite;
  }
}
