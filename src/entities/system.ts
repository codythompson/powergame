import { Graphics } from "pixi.js";
import { Entity, EntityPushParams } from "../entity";
import { CustomOnly, TemplateFunc, TemplateParams } from "../templates";
import { Rect } from "./components/position";
import nodeContext from "../graphics/node";
import { UnTyped } from "../types/typed";
import { makePort, PortTemplateParams, PortType } from "./port";

export const SystemType = "system";
export type System = Entity<typeof SystemType, Rect>;

export interface SystemTemplateParams
  extends TemplateParams<System>,
    UnTyped<Rect> {
  ports?: CustomOnly<PortTemplateParams>[];
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
  ports = [],
  collection,
}: SystemTemplateParams): EntityPushParams<System> {
  const bg = new Graphics(nodeContext);
  bg.x = x;
  bg.y = y;
  return {
    entity: {
      type: SystemType,
      name,
      components: {
        position: { type: "rect", x, y, w, h },
      },
    },
    sprite: bg,
    children: ports.map((p) => makePort({ ...p, collection, type: PortType })),
  };
};
