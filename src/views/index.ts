import { Container } from "pixi.js";
import { ViewCollection } from "../view";
import nodeMaker from "./node";
import slotMaker from "./slot";

export default function makeViewCollection(container:Container):ViewCollection {
  const makers = {
    Node: nodeMaker,
    Slot: slotMaker,
  }
  return new ViewCollection(container, makers)
}
