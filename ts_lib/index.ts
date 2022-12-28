import { assert } from "console";
import { readFileSync } from "fs";
import { resolve } from "path";

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
