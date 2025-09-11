import { isDef } from "./types/guards";
import { isTyped, Tracked, Typed } from "./types/typed";

export const SlotType = "Slot"
export type SlotType = typeof SlotType
export const NodeType = "Node"
export type NodeType = typeof NodeType
export const BufferType = "Buffer"
export type BufferType = typeof BufferType

export type ModelTypeString = SlotType|NodeType|BufferType

export interface Model<T extends ModelTypeString> extends Typed<T> {
  id?: number
  name?: string
}

export interface Rated<T extends ModelTypeString> extends Model<T> {
  rate: number;
}

export interface Slot<N extends SlotNames = SlotNames> extends Rated<SlotType> {
  connection: Node|undefined
  name: N
}
export type ConnectedSlot<N extends SlotNames = SlotNames> = Slot<N> & { connection: Node };
export enum SlotNames {
  out = "out",
  in = "in",
}

export function ifSlot<N extends SlotNames>(named:N, node:Node, then:(slot:Slot<N>)=>void) {
  const slot = node.slots.find(s => s.name === named)
  if (isDef(slot)) {
    then(slot as Slot<N>);
  }
}
export function ifConnected<N extends SlotNames>(named:N, node:Node, then:(slot:Slot<N>)=>void) {
  const slot = node.slots.find(s => s.name === named)
  if (isDef(slot) && isDef(slot.connection)) {
    then(slot as ConnectedSlot<N>);
  }
}

export interface Positioned {
  x: number
  y: number
}

export interface Node extends Rated<NodeType>, Positioned {
  slots: Slot[];
}

export interface Buffer extends Rated<BufferType>, Positioned {
  in: Node;
  out: Node;
}

export type ModelMap = {
  [SlotType]: Slot,
  [NodeType]: Node,
  [BufferType]: Buffer,
}

// export type ModelTypes = ModelMap[keyof ModelMap]

export type ModelType<T extends ModelTypeString> = ModelMap[T]

export class ModelCollection {
  private _models: Tracked<Model<ModelTypeString>>[] = []

  private _byType:{[K in keyof ModelMap]?: Tracked<ModelMap[K]>[]} = {}

  push(model:Model<ModelTypeString>):number {
    if (isDef(model.id)) {
      throw new Error(`[ModelCollection.push] can't push model with an existing id! was probably already pushed here or elsewhere ${model.id} name: ${model.name}`);
    }
    type NewModel = Tracked<Model<(typeof model)["type"]>>
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

  ofType<T extends ModelTypeString>(type:T):Tracked<ModelType<T>>[] {
    if (type in this._byType && isDef(this._byType[type])) {
      return this._byType[type] as Tracked<ModelType<T>>[]
    }
    return []
  }

  get<T extends ModelTypeString>(type:T, id:number):Tracked<ModelType<T>> {
    const model = this._models[id] as Tracked<ModelType<T>>|undefined
    if (!isDef(model)) {
      throw new Error(`[ModelCollection] no model found with id ${id}. max id: ${this._models.length}`);
    }
    if (!isTyped(model, type)) {
      throw new Error(`[ModelCollection] unexpected model type. expected ${type}, but found ${type}`);
    }
    return model
  }

  has(model:Model<ModelTypeString>):boolean {
    return isDef(model.id) && model.id < this._models.length;
  }
}
