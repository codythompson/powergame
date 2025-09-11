import { Container, Sprite } from "pixi.js";
import { Model, ModelTypeString } from "./models";

export interface ModelView<M extends Model<ModelTypeString>> {
  model:M
  view:Container|Sprite
}

export type ExtractModelFromView<MV> = MV extends ModelView<infer M> ? M : never;

export interface ModelViewFactory<MV extends ModelView<Model<ModelTypeString>>> {
  create(model: ExtractModelFromView<MV>): MV
}
