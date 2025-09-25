import { Graphics } from "pixi.js";
import { Entity, EntityPushParams } from "../entity";
import { TemplateFunc, TemplateParams } from "../templates";
import { PositionTypes } from "./components/position";
import nodeContext from "../graphics/node";

export const SystemType = "system";
export type System = Entity<typeof SystemType, PositionTypes>;

export interface SystemTemplateParams extends TemplateParams<System> {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export type SystemTemplateType = {
  T: typeof SystemType;
  E: System;
  P: SystemTemplateParams;
};

export const makeSystem: TemplateFunc<SystemTemplateType> = function ({
  name,
  x,
  y,
  w,
  h,
}: SystemTemplateParams): EntityPushParams<System> {
  const bg = new Graphics(nodeContext);
  bg.x = x;
  bg.y = y;
  return {
    entity: {
      type: SystemType,
      name,
      components: {
        position: { type: "position", x, y },
        dimension: { type: "dimension", w, h },
      },
    },
    sprites: {
      bg,
    },
    // children
  };
};
