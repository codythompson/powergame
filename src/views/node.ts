import { Graphics } from "pixi.js";
import { ifConnected, Node, SlotNames } from "../models.old"
import { ViewMaker } from "../view"
import nodeContext from "../graphics/node";

const nodeMaker:ViewMaker<Node> = (model, parent) => {
  const newNode = new Graphics(nodeContext);
  newNode.x = model.x;
  newNode.y = model.y;
  newNode.tint = 0x333011;

  ifConnected(SlotNames.in, model, slot => parent.push(slot));

  return newNode
}

export default nodeMaker;
