import { Typed } from "../../types/typed";

export interface Position extends Typed<"position"> {
  x: number;
  y: number;
}

export interface Dimension extends Typed<"dimension"> {
  w: number;
  h: number;
}

export type PositionTypes = Position | Dimension;
