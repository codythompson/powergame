// import { GraphicsContext } from "pixi.js";
import { Graphics } from "pixi.js";

// export default function makeNodeGraphic(w: number, h: number): GraphicsContext {
//   const gc = new GraphicsContext().rect(0, 0, w, h);
export default function makeNodeGraphic(w: number, h: number): Graphics {
  let gc = new Graphics();
  gc = gc.rect(0, 0, w, h).fill({
    color: "#903000",
  });
  return gc;
}
