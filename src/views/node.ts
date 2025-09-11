import { Node } from "../models"
import { View, ViewFactory } from "../view";

export class NodeViewFactory implements ViewFactory<Node> {
  create(model: Node): View<Node> {
    throw new Error("Method not implemented.");
  }
}
