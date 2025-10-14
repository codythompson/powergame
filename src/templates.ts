import { Entity, EntityCollection, EntityPushParams, PixiSprite } from "./entity";
import { isFunc, isObj } from "./types/guards";
import { TOf, Typed } from "./types/typed";

export interface TemplateParams<E extends Entity<string> = Entity<string>>
  extends Typed<TOf<E>> {
  collection: EntityCollection;
  name: string;
}

export type CustomOnly<TP extends TemplateParams> = Omit<
  TP,
  "type" | "collection"
>;

export type EntityFunc<
  TT extends TemplateType,
  T extends TemplateTypeT<TT> = TemplateTypeT<TT>
> = (params: TemplateTypeP<TT, T>) => TemplateTypeE<TT, T>;

export type SpriteFunc<
  TT extends TemplateType,
  T extends TemplateTypeT<TT> = TemplateTypeT<TT>
> = (params: TemplateTypeP<TT, T>) => PixiSprite|undefined;

export type ChildrenFunc<
  TT extends TemplateType,
  T extends TemplateTypeT<TT> = TemplateTypeT<TT>,
  CC extends TemplateType = TemplateType,
  C extends TemplateTypeT<CC> = TemplateTypeT<CC>
> = (params: TemplateTypeP<TT, T>) => EntityPushParams<TemplateTypeE<CC, C>>[]|undefined;

export type TemplateFunc<
  TT extends TemplateType,
  T extends TemplateTypeT<TT> = TemplateTypeT<TT>
> = (params: TemplateTypeP<TT, T>) => EntityPushParams<TemplateTypeE<TT, T>>;

export type TemplateType<
  T extends string = string,
  E extends Entity<T> = Entity<T>,
  P extends TemplateParams<E> = TemplateParams<E>,
> = {
  T: T;
  E: E;
  P: P;
};

// extract type string from TemplateType
export type TemplateTypeT<TT extends TemplateType> = TT["T"];

// extract entity type from TemplateType
export type TemplateTypeE<
  TT extends TemplateType,
  T extends TemplateTypeT<TT> = TemplateTypeT<TT>,
> = TT["E"] & Entity<T>;

// extract template params type from TemplateType
export type TemplateTypeP<
  TT extends TemplateType,
  T extends TemplateTypeT<TT> = TemplateTypeT<TT>,
> = TT["P"] & TemplateParams<TemplateTypeE<TT, T>>;

export type TemplateTypeSet<AllTT extends TemplateType<AllT>, AllT extends string> = {
  [T in TemplateTypeT<AllTT>]: TemplateType<
    T,
    TemplateTypeE<AllTT, T>,
    TemplateTypeP<AllTT, T>
  >;
};

// export type AllTemplateTypes<TTS extends TemplateTypeSet<TemplateType>> =
//   TTS[keyof TTS];

export type TemplateStore<TTS extends TemplateTypeSet<AllTT, AllT>, AllTT extends TemplateType<AllT>, AllT extends string> = {
  [T in AllT]: TemplateFunc<TTS[T]>|Template<TTS[T],TTS[AllT]>;
};

export interface  Template<
  TT extends TemplateType,
  CC extends TemplateType,
  T extends TemplateTypeT<TT> = TemplateTypeT<TT>,
  C extends TemplateTypeT<CC> = TemplateTypeT<CC>,
> {
  makeEntity: EntityFunc<TT, T>
  makeSprite: SpriteFunc<TT, T>
  makeChildren: ChildrenFunc<TT, T, CC, C>
  make: TemplateFunc<TT, T>
}

export abstract class BaseTemplate<
  TT extends TemplateType,
  CC extends TemplateType,
  T extends TemplateTypeT<TT> = TemplateTypeT<TT>,
  C extends TemplateTypeT<CC> = TemplateTypeT<CC>,
> implements Template<TT, CC, T, C> {
  makeEntity({type, name, collection}:TemplateTypeP<TT,T>): TemplateTypeE<TT,T> {
    return { type, name, collection, components: {} };
  }
  makeSprite(_: TemplateTypeP<TT,T>):PixiSprite|undefined {
    return undefined;
  }
  makeChildren(_: TemplateTypeP<TT, T>): EntityPushParams<TemplateTypeE<CC, C>>[]|undefined {
    return undefined;
  }
  make(params:TemplateTypeP<TT,T>): EntityPushParams<TemplateTypeE<TT, T>> {
    return {
      entity: this.makeEntity(params),
      sprite: this.makeSprite(params),
      children: this.makeChildren(params),
    }
  }
}

export class TemplateCollection<TTS extends TemplateTypeSet<AllTT,AllT>, AllTT extends TemplateType<AllT>, AllT extends string> {
  constructor(readonly templates = {} as TemplateStore<TTS, AllTT, AllT>) {}

  makeEntity<
    T extends AllT,
    EP = EntityPushParams<TemplateTypeE<TTS[T], T>>,
  >(type: T, params: Omit<TemplateTypeP<TTS[T], T>, "type">): EP {
    const template = this.templates[type];
    if (isFunc(template)) {
      return template({ type, ...params }) as EP;
    }
    if (isObj(template)) {
      return template.make({ type, ...params }) as EP;
    }
    throw new Error(`[TemplateCollection.makeEntity] unknown template type: '${type}'`)
  }
}
