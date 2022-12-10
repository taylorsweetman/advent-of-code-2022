import { readFileSync } from "fs";
import { logAndAssert } from "../../ts_lib";
import { resolve } from "path";
import _ from "lodash";

const logRope = () => {
  const maxX = _.max(rope.map((k) => k[0])) ?? 0;
  const minX = _.min(rope.map((k) => k[0])) ?? 0;
  const maxY = _.max(rope.map((k) => k[1])) ?? 0;
  const minY = _.min(rope.map((k) => k[1])) ?? 0;

  for (let i = minX; i <= maxX; i++) {
    let line = "";
    for (let j = minY; j <= maxY; j++) {
      const ropeIndex = _.findIndex(
        rope,
        (k) => JSON.stringify(k) === JSON.stringify([i, j])
      );
      if (ropeIndex > -1) {
        line += ropeIndex;
      } else {
        line += ".";
      }
    }
    console.log(line);
  }
  console.log("\n\n");
};

const parse = (input: string): [number, number][] => {
  const tuples = input.split("\n").map((line) => line.split(" ")) as [
    string,
    string
  ][];

  return tuples.map(([dir, num]) => {
    if (dir === "R") {
      return [0, parseInt(num)];
    } else if (dir === "L") {
      return [0, -1 * parseInt(num)];
    } else if (dir === "U") {
      return [-1 * parseInt(num), 0];
    } else {
      return [parseInt(num), 0];
    }
  });
};

let rope = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
] as [number, number][];
let locations = [_.last(rope)] as [number, number][];

const moveOne = (motion: [number, number]) => {
  for (let i = 0; i < rope.length - 1; i++) {
    const [deltaX, deltaY] = motion;

    const [headX, headY] = rope[i];
    const [tailX, tailY] = rope[i + 1];
    if (i === 0) rope[i] = [headX + deltaX, headY + deltaY];

    const xDiff = rope[i][0] - tailX;
    const yDiff = rope[i][1] - tailY;

    if (Math.abs(xDiff) > 1 && Math.abs(yDiff) > 0) {
      // diagonal 1
      rope[i + 1] = [xDiff > 0 ? tailX + 1 : tailX - 1, rope[i][1]];
    } else if (Math.abs(xDiff) > 0 && Math.abs(yDiff) > 1) {
      // diagonal 2
      rope[i + 1] = [rope[i][0], yDiff > 0 ? tailY + 1 : tailY - 1];
    } else if (xDiff > 1) {
      rope[i + 1] = [tailX + 1, tailY];
    } else if (xDiff < -1) {
      rope[i + 1] = [tailX - 1, tailY];
    } else if (yDiff > 1) {
      rope[i + 1] = [tailX, tailY + 1];
    } else if (yDiff < -1) {
      rope[i + 1] = [tailX, tailY - 1];
    }
  }
  locations.push(_.last(rope) ?? [0, 0]);
};

const move = (motion: [number, number]) => {
  let [xDelta, yDelta] = motion;
  while (xDelta > 0) {
    moveOne([1, 0]);
    xDelta--;
  }
  while (xDelta < 0) {
    moveOne([-1, 0]);
    xDelta++;
  }
  while (yDelta > 0) {
    moveOne([0, 1]);
    yDelta--;
  }
  while (yDelta < 0) {
    moveOne([0, -1]);
    yDelta++;
  }
  logRope();
};

const main = () => {
  const input = readFileSync(resolve(__dirname, "../input.txt"), "utf8");
  const motions = parse(input);
  logAndAssert(rope.length, 10);
  logAndAssert(motions.length, 2000);

  // Part 1
  motions.forEach((motion) => move(motion));
  const uniqLocations = _.uniqWith(locations, _.isEqual);
  logAndAssert(uniqLocations.length, 0);
};

main();
