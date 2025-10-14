import { Graphics } from "pixi.js";
import { Entity, EntityPushParams, PixiSprite } from "../entity";
import { BaseTemplate, CustomOnly, TemplateParams } from "../templates";
import { Rect } from "./components/position";
import nodeContext from "../graphics/node";
import { UnTyped } from "../types/typed";
import { makePort, Port, PortTemplateParams, PortTemplateType, PortType } from "./port";

export const SystemType = "system";
export type System = Entity<typeof SystemType, Rect>;

export interface SystemTemplateParams
  extends TemplateParams<System>,
    UnTyped<Rect> {
  ports: CustomOnly<PortTemplateParams>[];
}

export type SystemTemplateType = {
  T: typeof SystemType;
  E: System;
  P: SystemTemplateParams;
};

export class SystemTemplate extends BaseTemplate<SystemTemplateType, PortTemplateType> {
  makeSprite({x,y}: SystemTemplateParams): PixiSprite {
    const bg = new Graphics(nodeContext);
    bg.x = x;
    bg.y = y;
    return bg;
  }

  makeChildren({ports = [], collection}: SystemTemplateParams): EntityPushParams<Port>[] {
    return ports.map((p) => makePort({ ...p, collection, type: PortType }));
  }

  makeEntity({name, x, y, w, h}:SystemTemplateParams): System {
    return {
      type: SystemType,
      name,
      components: {
        position: { type: "rect", x, y, w, h },
      },
    };
  }
};
