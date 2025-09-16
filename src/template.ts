import { Entity, PixiSprite } from "./entities";
import { ModelCollection } from "./models.old";
import { Typed } from "./types/typed";

export interface TemplateParams<T extends string = string> extends Typed<T> {
  collection: ModelCollection;
  name: string;
}

export type TemplateFunc<E extends Entity, P extends TemplateParams> = (
  params: P,
) => EntityPushParams<E>;

export interface Template<
  E extends Entity,
  P extends TemplateParams = TemplateParams,
> {
  create(params: P): E;
}
