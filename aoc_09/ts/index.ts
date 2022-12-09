import { readFileSync } from "fs";
import { logAndAssert } from "../../ts_lib";
import _ from "lodash";

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

let headPos = [0, 0] as [number, number];
let tailPos = [0, 0] as [number, number];
let locations = [tailPos] as [number, number][];

const moveOne = (motion: [number, number]) => {
  const [deltaX, deltaY] = motion;

  const [headX, headY] = headPos;
  const [tailX, tailY] = tailPos;
  headPos = [headX + deltaX, headY + deltaY];

  const xDiff = headPos[0] - tailX;
  const yDiff = headPos[1] - tailY;

  if (Math.abs(xDiff) > 1 && Math.abs(yDiff) > 0) {
    // diagonal 1
    tailPos = [xDiff > 0 ? tailX + 1 : tailX - 1, headPos[1]];
  } else if (Math.abs(xDiff) > 0 && Math.abs(yDiff) > 1) {
    // diagonal 2
    tailPos = [headPos[0], yDiff > 0 ? tailY + 1 : tailY - 1];
  } else if (xDiff > 1) {
    tailPos = [tailX + 1, tailY];
  } else if (xDiff < -1) {
    tailPos = [tailX - 1, tailY];
  } else if (yDiff > 1) {
    tailPos = [tailX, tailY + 1];
  } else if (yDiff < -1) {
    tailPos = [tailX, tailY - 1];
  }
  locations.push(tailPos);
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
};

const main = () => {
  const input = readFileSync("../input.txt", "utf8");
  const motions = parse(input);
  logAndAssert(motions.length, 2000);

  // Part 1
  motions.forEach((motion) => move(motion));
  const uniqLocations = _.uniqWith(locations, _.isEqual);
  logAndAssert(uniqLocations.length, 6_030);
};

main();
