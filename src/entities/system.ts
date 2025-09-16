import { Entity, EntityPushParams } from "../entities";
import { TemplateParams } from "../template";
import { PositionTypes } from "./components/position";

export type System = Entity<"system", PositionTypes>;

export interface SystemTemplateParams extends TemplateParams<System["type"]> {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function makeSystem({
  name,
  x,
  y,
  w,
  h,
}: SystemTemplateParams): EntityPushParams<System> {
  return {
    entity: {
      type: "system",
      name,
      components: {
        position: { type: "position", x, y },
        dimension: { type: "dimension", w, h },
      },
    },
    sprites: {},
    // children
  };
}
