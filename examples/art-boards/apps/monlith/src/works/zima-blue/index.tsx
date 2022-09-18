import React from "react";

import {
  Canvas,
  Loader,
  LoaderResource,
  Application,
  Sprite,
  Graphics,
  Dict,
} from "@art-boards/ui-canvas";

export default function ZimaBlue() {
  return (
    <Canvas
      mount={(element) => {
        if (!element) return () => {};

        const app = new Application({
          antialias: true,
          backgroundColor: 0x202124,
          width: 1024,
          height: Math.max(
            document.documentElement.clientHeight || 0,
            window.innerHeight || 0
          ),
        });
        element.appendChild(app.view);

        app.loader.add("earth", "/earth.png");
        app.loader.add("robot", "/robot.png");
        app.loader.load(setup);

        function setup(_: Loader, resources: Dict<LoaderResource>) {
          const earth = new Sprite(resources.earth.texture);
          earth.scale.set(0.3, 0.3);
          earth.x = app.screen.width / 4;
          earth.y = app.screen.height / 2;
          app.stage.addChild(earth);

          const graphics = new Graphics();
          graphics.beginFill(0xff3300);
          graphics.lineStyle(5, 0xffd900, 1);
          app.stage.addChild(graphics);

          const thing = new Graphics();
          thing.x = 800 / 2;
          thing.y = 600 / 2;
          app.stage.addChild(thing);
          app.renderer.plugins.interaction.on("pointerdown", onPointerDown);

          let x = 20;
          let y = 10;
          let robot: Sprite;

          function onPointerDown() {
            x = x * 1.4;
            y = y * 1.5;

            graphics.lineStyle(Math.random() * 30, Math.random() * 0xffffff, 1);
            graphics.moveTo(Math.random() * 800, Math.random() * 600);
            graphics.bezierCurveTo(
              Math.random() * 400,
              Math.random() * 300,
              Math.random() * 400,
              Math.random() * 300,
              Math.random() * 400,
              Math.random() * 300
            );

            if (x > 1024 && !robot) {
              robot = new Sprite(resources.robot.texture);
              robot.scale.set(0.7, 0.7);
              robot.scale.x *= -1;
              robot.anchor.x = 1;
              robot.x = 0;
              robot.y = app.screen.height - robot.height || 163;
              app.stage.addChild(robot);
            }
          }

          let moveX = 0;
          let count = 0;
          let robotLowerBound = 0;

          app.ticker.add(() => {
            if (robot) {
              if (robot.x > app.renderer.width) {
                moveX = -5;
                robot.anchor.x = 0;
                robot.scale.x *= -1;
                robotLowerBound = robot.width;
              }
              if (robot.x <= robotLowerBound) {
                moveX = 5;
                robot.anchor.x = 1;
                robot.scale.x *= -1;
              }
              robot.x = robot.x + moveX;
            }

            count += 0.1;
            thing.clear();
            thing.beginFill(0x16b8f3, 1);
            thing.moveTo(
              -1 * x + Math.sin(count) * 5,
              -1 * y + Math.cos(count) * 5
            );
            thing.lineTo(x + Math.cos(count) * 5, -1 * y + Math.sin(count) * 5);
            thing.lineTo(x + Math.sin(count) * 5, y + Math.cos(count) * 5);
            thing.lineTo(-1 * x + Math.cos(count) * 5, y + Math.sin(count) * 5);
            thing.lineTo(
              -1 * x + Math.sin(count) * 5,
              -1 * y + Math.cos(count) * 5
            );
            thing.closePath();
            thing.rotation = count * 0.1;
          });
        }
        return () => app.destroy();
      }}
    />
  );
}