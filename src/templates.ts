import { Entity, EntityCollection, EntityPushParams } from "./entity";
import { TOf, Typed } from "./types/typed";

export interface TemplateParams<E extends Entity<string> = Entity<string>>
  extends Typed<TOf<E>> {
  collection: EntityCollection;
  name: string;
}

export type TemplateFunc<
  TT extends TemplateType,
  T extends TemplateTypeT<TT> = TemplateTypeT<TT>,
> = (params: TemplateTypeP<TT, T>) => EntityPushParams<TemplateTypeE<TT>>;

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

export type TemplateTypeSet<AllTT extends TemplateType> = {
  [T in TemplateTypeT<AllTT>]: TemplateType<
    T,
    TemplateTypeE<AllTT, T>,
    TemplateTypeP<AllTT, T>
  >;
};

export type AllTemplateTypes<TTS extends TemplateTypeSet<TemplateType>> =
  TTS[keyof TTS];

export type TemplateStore<TTS extends TemplateTypeSet<TemplateType>> = {
  [T in TemplateTypeT<AllTemplateTypes<TTS>>]: TemplateFunc<TTS[T]>;
};

export class TemplateCollection<TTS extends TemplateTypeSet<TemplateType>> {
  constructor(readonly templates = {} as TemplateStore<TTS>) {}

  makeEntity<
    T extends TemplateTypeT<AllTemplateTypes<TTS>>,
    EP = EntityPushParams<TemplateTypeE<TTS[T], T>>,
  >(type: T, params: Omit<TemplateTypeP<TTS[T], T>, "type">): EP {
    return this.templates[type]({ type, ...params }) as EP;
  }
}
