import { Graphics } from ".";

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createStar() {
  const graphics = new Graphics();
  graphics.lineStyle(4, 0xffffff);
  graphics.beginFill(0xffcc5a, 1);
  graphics.drawStar?.(
    getRandomInt(100, 800),
    getRandomInt(100, 600),
    5,
    getRandomInt(30, 50),
    20,
    getRandomInt(0, 360)
  );
  graphics.endFill();

  return graphics;
}
