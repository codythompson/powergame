import { GraphicsContext } from "pixi.js";

const w = 64;
const h = 64;
let nodeContext = new GraphicsContext();
nodeContext = nodeContext.rect(0, 0, w, h).fill({
  color: "#ffffff",
});

export default nodeContext;
