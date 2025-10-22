import { Entity, PixiSprite } from "../entity";
import { BaseTemplate, TemplateParams } from "../templates";
import { Port, PortTemplateType } from "./port";
import { PortSpec } from "./components/portSpec";
import { makeWire } from "../graphics/wire";
import { isDef } from "../types/guards";
import { System } from "./system";
import { Rect } from "./components/position";

export const WireType = "wire";

export type Wire = Entity<typeof WireType, PortSpec>;

export interface WireTemplateParams extends TemplateParams<Wire> {
  portAId: number;
  portBId: number;
}

export type WireTemplateType = {
  T: typeof WireType;
  E: Wire;
  P: WireTemplateParams;
};

export class WireTemplate extends BaseTemplate<
  WireTemplateType,
  PortTemplateType
> {
  makeSprite({ portAId, portBId, collection }: WireTemplateParams): PixiSprite {
    const pAEnt = collection.getNode<Port>(portAId);
    const pBEnt = collection.getNode<Port>(portBId);
    if (!isDef(pAEnt) || !isDef(pBEnt)) {
      throw new Error("undef portAB");
    }
    const pAPos = (pAEnt.toParent()?.entity as System).components
      .position as Rect;
    const pBPos = (pBEnt.toParent()?.entity as System).components
      .position as Rect;
    if (!isDef(pAPos) || !isDef(pBPos)) {
      throw new Error("undef portAB parent pos");
    }
    return makeWire(pAPos.x, pAPos.y, pBPos.x, pBPos.y);
  }
}
