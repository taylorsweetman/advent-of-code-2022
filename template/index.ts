import { logAndAssert, readInput } from "../../ts_lib";

const parse = (input: string) => {
  const lines = input.split("\n");
  return lines;
};

const main = () => {
  const parsed = parse(readInput(__dirname));

  // Part 1
  logAndAssert(1, 1);

  // Part 2
  logAndAssert(1, 1);
};

main();
