import { Graphics } from "pixi.js";
import { Entity } from "../entity";
import { TemplateFunc, TemplateParams } from "../templates";
import { UnTyped } from "../types/typed";
import { Rect } from "./components/position";
import { PortSpec, PortSpecType } from "./portSpec";
import nodeContext from "../graphics/node";

export const PortType = "port";
export type Port = Entity<typeof PortType, PortSpec>;

export interface PortTemplateParams
  extends TemplateParams<Port>,
    Partial<UnTyped<PortSpec>>,
    Partial<UnTyped<Rect>> {}

export type PortTemplateType = {
  T: typeof PortType;
  E: Port;
  P: PortTemplateParams;
};

export const makePort: TemplateFunc<PortTemplateType> = function ({
  name,
  connectorType = "dc",
  maxVolume = 2,
  minVolume = 1,
  x = 0,
  y = 0,
  w = 1 / 4,
  h = 1 / 4,
}) {
  const sprite = new Graphics(nodeContext);
  sprite.x = x;
  sprite.y = y;
  sprite.scale.set(w, h);
  sprite.tint = connectorType === "bee" ? 0x00ffaa : 0x00aaff;
  sprite.pivot.set(32, 32);
  return {
    entity: {
      type: PortType,
      name,
      components: {
        spec: {
          type: PortSpecType,
          connectorType,
          maxVolume,
          minVolume,
        },
      },
    },
    sprite,
  };
};
