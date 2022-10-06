import React, { useEffect } from "react";

import {
  Canvas,
  Loader,
  LoaderResource,
  Application,
  Sprite,
  Graphics,
  Dict,
  utils,
} from "@art-boards/ui-canvas";

export default function ZimaBlue() {
  useEffect(() => utils.clearTextureCache);

  return (
    <Canvas
      mount={(element) => {
        if (!element) return () => {};

        const app = new Application({
          antialias: true,
          backgroundColor: 0x202124,
          width: window.innerWidth * 0.7,
          height: Math.max(
            document.documentElement.clientHeight || 0,
            window.innerHeight || 0
          ),
        });
        element.appendChild(app.view);

        if (!app.loader.loading) {
          app.loader.add("earth", "/earth.png");
          app.loader.add("robot", "/robot.png");
          app.loader.load(setup);
        }

        function setup(_: Loader, resources: Dict<LoaderResource>) {
          const earth = new Sprite(resources.earth.texture);
          earth.scale.set(0.3, 0.3);
          earth.x = app.screen.width / 6;
          earth.y = app.screen.height / 3;
          app.stage.addChild(earth);

          const swimmingPool = new Graphics();
          swimmingPool.x = 800 / 2;
          swimmingPool.y = 600 / 2;
          app.stage.addChild(swimmingPool);
          app.renderer.plugins.interaction.on("pointerdown", onPointerDown);

          let x = 20;
          let y = 10;
          let robot: Sprite;

          function onPointerDown() {
            x = x * 1.4;
            y = y * 1.5;

            if (x > window.innerWidth * 0.7 && !robot) {
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
            swimmingPool.clear();
            swimmingPool.beginFill(0x16b8f3, 1);
            swimmingPool.moveTo(
              -1 * x + Math.sin(count) * 5,
              -1 * y + Math.cos(count) * 5
            );
            swimmingPool.lineTo(
              x + Math.cos(count) * 5,
              -1 * y + Math.sin(count) * 5
            );
            swimmingPool.lineTo(
              x + Math.sin(count) * 5,
              y + Math.cos(count) * 5
            );
            swimmingPool.lineTo(
              -1 * x + Math.cos(count) * 5,
              y + Math.sin(count) * 5
            );
            swimmingPool.lineTo(
              -1 * x + Math.sin(count) * 5,
              -1 * y + Math.cos(count) * 5
            );
            swimmingPool.closePath();
            swimmingPool.rotation = count * 0.1;
          });
        }

        return () => {
          element.removeChild(app.view);
          app.destroy();
        };
      }}
    />
  );
}
