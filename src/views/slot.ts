import { Slot } from "../models.old";
import { PixiView, ViewMaker } from "../view";

const slotMaker:ViewMaker<Slot> = (model, parent):PixiView => {
  // const newWire = makeWire()
  throw new Error("Slots as views don't make sense - need rethink model(s)")
}

export default slotMaker;
