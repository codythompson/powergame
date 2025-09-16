import { Typed } from "../../types/typed";

export type PositionType = "position";
export interface Position extends Typed<PositionType> {
  x: number;
  y: number;
}

export type DimensionType = "dimension";
export interface Dimension extends Typed<DimensionType> {
  w: number;
  h: number;
}

export type PositionTypes = Position | Dimension;
