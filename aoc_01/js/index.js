import { readFileSync } from "fs";
import { descending, logAndAssert, sum } from "../../js_lib/index.js";

const main = () => {
  const input = readFileSync("../input.txt", "utf8");

  // part 1
  const foodPerElf = input
    .split("\n\n")
    .map((chunk) => chunk.split("\n").map((line) => parseInt(line)));
  const calsPerElf = foodPerElf.map(sum).sort(descending);
  const maxCals = calsPerElf[0];
  logAndAssert(maxCals, 24000);

  // part 2
  const topThreeCalories = sum(calsPerElf.slice(0, 3));
  logAndAssert(topThreeCalories, 45000);
};

main();
