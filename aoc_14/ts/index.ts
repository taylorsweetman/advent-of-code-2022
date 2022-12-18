import { logAndAssert, readInput } from "../../ts_lib";

type Cave = {
  lowestRock: number;
  fullCoords: Set<string>;
};

const downCoord = (coord: string): string =>
  coord
    .split(",")
    .reduce(
      (acc, curr, idx) => (idx === 0 ? curr : `${acc},${parseInt(curr) + 1}`),
      ""
    );
const rightCoord = (coord: string): string =>
  coord
    .split(",")
    .reduce(
      (acc, curr, idx) =>
        idx === 0 ? `${parseInt(curr) + 1}` : `${acc},${curr}`,
      ""
    );
const downLeftCoord = (coord: string): string =>
  coord
    .split(",")
    .reduce(
      (acc, curr, idx) =>
        idx === 0 ? `${parseInt(curr) - 1}` : `${acc},${curr + 1}`,
      ""
    );
const downRightCoord = (coord: string): string =>
  coord
    .split(",")
    .reduce(
      (acc, curr, idx) =>
        idx === 0 ? `${parseInt(curr) + 1}` : `${acc},${curr + 1}`,
      ""
    );
const getX = (coord: string): number => parseInt(coord.split(",")[0]);
const getY = (coord: string): number => parseInt(coord.split(",")[1]);

const fillVertically = (
  start: string,
  end: string,
  set: Set<string>
): Set<string> => {
  set.add(start);
  if (getY(start) === getY(end)) {
    return set;
  }

  return fillVertically(downCoord(start), end, set);
};

const fillHorizontally = (
  start: string,
  end: string,
  set: Set<string>
): Set<string> => {
  set.add(start);
  if (getX(start) === getX(end)) {
    return set;
  }

  return fillHorizontally(rightCoord(start), end, set);
};

const fillSet = (
  left: string,
  right: string,
  set: Set<string>
): Set<string> => {
  if (getX(left) > getX(right)) {
    return fillHorizontally(right, left, set);
  } else if (getX(left) < getX(right)) {
    return fillHorizontally(left, right, set);
  } else if (getY(left) > getY(right)) {
    return fillVertically(right, left, set);
  } else if (getY(left) < getY(right)) {
    return fillVertically(left, right, set);
  } else {
    return set;
  }
};

const findLowest = (set: Set<string>) =>
  [...set].reduce((acc, c) => (getY(c) > acc ? getY(c) : acc), 0);

const parse = (input: string): Cave => {
  const coordStrings: string[][] = input
    .split("\n")
    .map((line) => line.split("->").map((str) => str.trim()));

  const set = coordStrings.reduce((acc, current) => {
    for (let i = 0; i < current.length - 1; i++) {
      acc = fillSet(current[i], current[i + 1], acc);
    }
    return acc;
  }, new Set<string>());

  return { fullCoords: set, lowestRock: findLowest(set) };
};

const main = () => {
  const cave = parse(readInput(__dirname));
  console.log(cave);
};

main();
