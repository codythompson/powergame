import { Typed, UnTyped } from "../../types/typed";

export interface Position extends Typed<"position"> {
  x: number;
  y: number;
}

export interface Dimension extends Typed<"dimension"> {
  w: number;
  h: number;
}

export interface Rect
  extends UnTyped<Position>,
    UnTyped<Dimension>,
    Typed<"rect"> {}

export type PositionTypes = Position | Dimension | Rect;
