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
