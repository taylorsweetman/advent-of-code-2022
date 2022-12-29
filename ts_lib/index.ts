import { assert } from "console";
import { readFileSync } from "fs";
import { resolve } from "path";
import _ from "lodash";

export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

export const ascending = (a: number, b: number) => a - b;

export const descending = (a: number, b: number) => b - a;

export const logAndAssert = (actual: any, expected: any) => {
  console.log({ actual, expected });
  assert(actual === expected);
};

export const isUpperCase = (char: string) => char === char.toUpperCase();

export const readInput = (dirname: string) =>
  readFileSync(resolve(dirname, "../input.txt"), "utf8");

export class Coord {
  id: string;
  arr: number[];
  x: number;
  y: number;
  z: number;

  constructor(coordStr: string) {
    this.id = coordStr;
    this.arr = this.id.split(",").map((num) => parseInt(num));
    this.x = this.arr[0];
    this.y = this.arr[1];
    this.z = this.arr[2];
  }

  static fromArr(arr: number[]) {
    return new Coord(arr.join(","));
  }

  adjacentCords() {
    return [
      new Coord(`${this.x - 1},${this.y},${this.z}`),
      new Coord(`${this.x + 1},${this.y},${this.z}`),
      new Coord(`${this.x},${this.y - 1},${this.z}`),
      new Coord(`${this.x},${this.y + 1},${this.z}`),
      new Coord(`${this.x},${this.y},${this.z - 1}`),
      new Coord(`${this.x},${this.y},${this.z + 1}`),
    ];
  }

  isAdjecentTo(coord: Coord) {
    return this.adjacentCords().some((c) => c.id === coord.id);
  }

  xMinusOne() {
    return new Coord(`${this.x - 1},${this.y},${this.z}`);
  }

  xPlusOne() {
    return new Coord(`${this.x + 1},${this.y},${this.z}`);
  }

  yMinusOne() {
    return new Coord(`${this.x},${this.y - 1},${this.z}`);
  }

  yPlusOne() {
    return new Coord(`${this.x},${this.y + 1},${this.z}`);
  }

  zMinusOne() {
    return new Coord(`${this.x},${this.y},${this.z - 1}`);
  }

  zPlusOne() {
    return new Coord(`${this.x},${this.y},${this.z + 1}`);
  }

  isPastMin(min: Coord) {
    return this.x < min.x || this.y < min.y || this.z < min.z;
  }

  isPastMax(max: Coord) {
    return this.x > max.x || this.y > max.y || this.z > max.z;
  }
}

export type CoordPair = [Coord, Coord];

const isBetweenPoints = (num: number, { x, y }: Coord) => num >= x && num <= y;

export const overlaps = (l: Coord, r: Coord) => {
  const { x: lStart, y: lEnd } = l;
  const { x: rStart, y: rEnd } = r;
  return (
    isBetweenPoints(lStart - 1, r) ||
    isBetweenPoints(lEnd + 1, r) ||
    isBetweenPoints(rStart - 1, l) ||
    isBetweenPoints(rEnd + 1, l)
  );
};

const merge = (left: Coord, right: Coord) =>
  Coord.fromArr([Math.min(left.x, right.x), Math.max(left.y, right.y)]);

export const mergeAll = (toMerge: Coord, existing: Coord[]): Coord[] => {
  let mergesToFind = _.uniqBy([toMerge, ...existing], "id");
  let foundMerges: CoordPair[] = [];

  mergesToFind.forEach((toMerge, outerIdx) => {
    const mergeIdx = mergesToFind.findIndex(
      (mergee, innerIdx) => innerIdx > outerIdx && overlaps(toMerge, mergee)
    );
    if (mergeIdx !== -1) {
      foundMerges.push([toMerge, mergesToFind[mergeIdx]] as CoordPair);
      mergesToFind.splice(mergeIdx, 1);
      mergesToFind.splice(
        mergesToFind.findIndex((c) => c.id === toMerge.id),
        1
      );
    }
  });

  if (foundMerges.length === 0) {
    return mergesToFind;
  }

  const newList = [
    ...mergesToFind,
    ...foundMerges.map((toMerge) => merge(toMerge[0], toMerge[1])),
  ];

  return mergeAll(newList[0], newList);
};
