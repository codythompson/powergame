import { Graphics } from "pixi.js";

function midPoint(a: number, b: number): number {
  // eslint-disable-next-line prettier/prettier
  return a + ((b - a) / 2);
}

export function makeWire(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): Graphics {
  const radius = 32;
  const wire = new Graphics()
    .moveTo(x1, y1)
    .quadraticCurveTo(midPoint(x1, x2), midPoint(y1, y2) + radius, x2, y2)
    .stroke({ width: 2 });
  return wire;
}
