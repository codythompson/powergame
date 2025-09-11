import { isDef } from "./types/guards";
import { isTyped, Typed } from "./types/typed";

export const SlotType = "Slot"
export type SlotType = typeof SlotType
export const NodeType = "Node"
export type NodeType = typeof NodeType
export const BufferType = "Buffer"
export type BufferType = typeof BufferType

export type ModelTypeString = SlotType|NodeType|BufferType

export interface Model<T extends ModelTypeString> extends Typed<T> {
  id: number
  name?: string
}

export interface Rated<T extends ModelTypeString> extends Model<T> {
  rate: number;
}

export interface Slot extends Rated<SlotType> {
  connection: Node|undefined
}

export interface Node extends Rated<NodeType> {
  slots: Slot[];
}

export interface Buffer extends Rated<BufferType> {
  in: Node;
  out: Node;
}

export type ModelMap = {
  [SlotType]: Slot,
  [NodeType]: Node,
  [BufferType]: Buffer,
}
export type ModelMapArray = {
}

// export type ModelTypes = ModelMap[keyof ModelMap]

export type ModelType<T extends ModelTypeString> = ModelMap[T]

export class ModelCollection {
  private _models: Model<ModelTypeString>[] = []

  private _byType:{[K in keyof ModelMap]?: ModelMap[K][]} = {}

  push(model:Omit<Model<ModelTypeString>, "id">):number {
    type NewModel = Model<(typeof model)["type"]>
    const mTmp = model as any
    mTmp.id = this._models.length
    const m = mTmp as NewModel
    this._models.push(m)
    if (!(model.type in this._byType)) {
      this._byType[model.type] = []
    }
    (this._byType[model.type] as NewModel[]).push(m)
    return m.id
  }

  ofType<T extends ModelTypeString>(type:T):ModelType<T>[] {
    if (type in this._byType && isDef(this._byType[type])) {
      return this._byType[type] as ModelType<T>[]
    }
    return []
  }

  get<T extends ModelTypeString>(type:T, id:number):ModelType<T> {
    const model = this._models[id] as ModelType<T>|undefined
    if (!isDef(model)) {
      throw new Error(`[ModelCollection] no model found with id ${id}. max id: ${this._models.length}`);
    }
    if (!isTyped(model, type)) {
      throw new Error(`[ModelCollection] unexpected model type. expected ${type}, but found ${type}`);
    }
    return model
  }
}
