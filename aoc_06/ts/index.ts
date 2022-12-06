import { readFileSync } from "fs";
import { logAndAssert } from "../../ts_lib";

const findFirstMarker = (str: string, len: number) => {
  for (let i = 0; i < str.length - len + 1; i++) {
    const set = new Set([...str.substring(i, i + len)]);
    if (set.size === len) return i + len;
  }
};

const main = () => {
  const input = readFileSync("../input.txt", "utf8");

  // Part 1
  logAndAssert(findFirstMarker(input, 4), 1100);

  // Part 2
  logAndAssert(findFirstMarker(input, 14), 2421);
};

main();
