import { assert } from "console";

export const sum = (arr) => arr.reduce((a, b) => a + b, 0);

export const ascending = (a, b) => a - b;

export const descending = (a, b) => b - a;

export const logAndAssert = (actual, expected) => {
  console.log({ actual, expected });
  assert(actual === expected);
};
