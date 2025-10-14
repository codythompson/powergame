import { Application, Container, Rectangle } from "pixi.js";

import "./assets";
import { Node } from "./entity";
import { makeGame } from "./entities";
import { System } from "./entities/system";
import { isDef } from "./types/guards";
import { Tracked } from "./types/typed";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#210", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const bg = new Container({
    boundsArea: new Rectangle(0, 0, 1920, 1080),
    eventMode: "static",
    interactive: true,
    hitArea: new Rectangle(0, 0, 1920, 1080),
  });
  app.stage.addChild(bg);

  const game = makeGame(bg);

  // let lastNode: Node | undefined = undefined;
  let lastSystem: Node<Tracked<System>> | undefined = undefined;
  bg.on("click", (e) => {
    const newSystem = game.makeEntity("system", {
      name: "a" + e.x,
      x: e.x,
      y: e.y,
      w: 100,
      h: 100,
      ports: [
        {
          y: 64,
          name: "a",
        },
        {
          x: 64,
          y: 64,
          name: "b",
          connectorType: "bee",
          maxVolume: 20,
        },
      ],
    });

    if (isDef(lastSystem)) {
      // game.makeEntity("wire", {
      //   portAId = game.entities.getNode(lastSystem.id).???
      // });
    }

    lastSystem = newSystem;
    //   const newNode: Node = {
    //     type: "Node",
    //     slots: [
    //       {
    //         type: "Slot",
    //         name: SlotNames.out,
    //         rate: 1,
    //         connection: undefined,
    //       },
    //       {
    //         type: "Slot",
    //         name: SlotNames.in,
    //         rate: -1,
    //         connection: lastNode,
    //       },
    //     ],
    //     rate: 1,
    //     x: e.x,
    //     y: e.y,
    //   };
    //   if (isDef(lastNode)) {
    //     const slot = lastNode.slots.find((s) => s.name === SlotNames.out)!;
    //     slot.connection = newNode;
    //   }
    //   views.push(newNode);
  });
})();

// Load the bunny texture
// const texture = await Assets.load("/assets/bunny.png");

// // Create a bunny Sprite
// const bunny = new Sprite(texture);

// // Center the sprite's anchor point
// bunny.anchor.set(0.5);

// // Move the sprite to the center of the screen
// bunny.position.set(app.screen.width / 2, app.screen.height / 2);

// // Add the bunny to the stage
// app.stage.addChild(bunny);

// const landContainer = new Container({
//   hitArea: new Rectangle(0, 0, 1000, 1000),
//   eventMode: "static",
// });
// app.stage.addChild(landContainer);

// const nodeGraphic = makeNodeGraphic(128, 268);
// nodeGraphic.x = 96;
// nodeGraphic.y = 64;
// nodeGraphic.tint = 0x443322;
// landContainer.addChild(nodeGraphic);

// const tmpText = new BitmapText({
//   text: "oy! drld! ya tear m8?",
//   style: {
//     fontFamily: "consolas",
//   },
// });
// landContainer.addChild(tmpText);

// let lastMade: Graphics | undefined = undefined;

// landContainer.on("click", (e) => {
// const newNode = new Graphics(nodeContext);
// newNode.x = e.x;
// newNode.y = e.y;
// newNode.tint = 0x333011;
// landContainer.addChild(newNode);

// if (isDef(lastMade)) {
//   const newWire = makeWire(lastMade.x, lastMade.y, newNode.x, newNode.y);
//   newWire.tint = 0x888822;
//   landContainer.addChild(newWire);
// }

// lastMade = newNode;
// });

// Listen for animate update
// app.ticker.add((time) => {
//   // Just for fun, let's rotate mr rabbit a little.
//   // * Delta is 1 if running at 100% performance *
//   // * Creates frame-independent transformation *
//   bunny.rotation += 0.1 * time.deltaTime;
// });
