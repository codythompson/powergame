import { Container, Sprite } from "pixi.js";
import { Model, ModelCollection, ModelType, ModelTypeString } from "./models";
import { isDef } from "./types/guards";

export type PixiView = Container|Sprite;

export interface View {
  id:number
  model:number
  view:PixiView
}

export class ViewCollection {
  private readonly _views: View[] = []
  private readonly _makers: { [K in ModelTypeString]?: ViewMaker<ModelType<K>> } = {}
  private readonly _models:ModelCollection = new ModelCollection()

  constructor(readonly container:Container) {}

  push(model:Model<ModelTypeString>):number {
    const viewId = this._views.length;
    const modelId = this._models.push(model);
    const pixiView = this.getMaker(model.type)(this, model as ModelType<typeof model.type>);
    this._views.push({
      id: viewId,
      model: modelId,
      view: pixiView,
    });
    this.container.addChild(pixiView);
    return viewId;
  }

  getMaker<T extends ModelTypeString>(type:T):ViewMaker<ModelType<T>> {
    const maker = this._makers[type]
    if (!isDef(maker)) {
      throw new Error(`[ViewCollection] no maker found for model type ${type}`);
    }
    return maker as ViewMaker<ModelType<T>>
  }
}


export type ViewMaker<M extends Model<ModelTypeString>> = (parent: ViewCollection, model:M) => PixiView;

