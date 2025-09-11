import { Container, Sprite } from "pixi.js";
import { Model, ModelCollection, ModelType, ModelTypeString } from "./models.old";
import { isDef } from "./types/guards";

export type PixiView = Container|Sprite;

export interface View {
  id:number
  model:number
  view:PixiView
}

export class ViewCollection {
  private readonly _views: View[] = []
  private readonly _models:ModelCollection = new ModelCollection()

  constructor(readonly container:Container, readonly makers: { [K in ModelTypeString]?: ViewMaker<ModelType<K>> }) {}

  push(model:Model<ModelTypeString>):number {
    const existing = this.getViewFor(model);
    if (isDef(existing)) {
      throw new Error(`[ViewCollection.push] model with id ${model.id} name:${model.name} - already pushed!`);
    }
    const viewId = this._views.length;
    const modelId = this._models.push(model);
    const pixiView = this.getMaker(model.type)(model as ModelType<typeof model.type>, this);
    this._views.push({
      id: viewId,
      model: modelId,
      view: pixiView,
    });
    this.container.addChild(pixiView);
    return viewId;
  }

  getMaker<T extends ModelTypeString>(type:T):ViewMaker<ModelType<T>> {
    const maker = this.makers[type]
    if (!isDef(maker)) {
      throw new Error(`[ViewCollection] no maker found for model type ${type}`);
    }
    return maker as ViewMaker<ModelType<T>>
  }

  getViewFor(model:Model<ModelTypeString>):View|undefined {
    if (!isDef(model.id) || !this._models.has(model)) {
      return undefined;
    }
    return this._views.find(v => v.model === model.id)
  }
}


export type ViewMaker<M extends Model<ModelTypeString>> = (model:M, parent: ViewCollection) => PixiView;

