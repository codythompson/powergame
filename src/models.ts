import { Typed } from "./types/typed";

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

export type ModelType<T extends ModelTypeString> = ModelMap[T]
