import { readFileSync } from "fs";
import _ from "lodash";
import { isUpperCase, logAndAssert, sum } from "../../js_lib/index.js";

const findDup = (sets: Set<String>[]) => {
  const [first, ...others] = sets;

  return [...first].reduce(
    (acc, item) => (others.every((set) => set.has(item)) ? item : acc),
    ""
  );
};

const itemPriority = (item: String) =>
  isUpperCase(item) ? item.charCodeAt(0) - 38 : item.charCodeAt(0) - 96;

const main = () => {
  const input = readFileSync("../input.txt", "utf8");

  // Part 1
  const uniqueCompartmentContents = input.split("\n").map((line) => {
    const middle = line.length / 2;
    return [
      new Set([...line.substring(0, middle)]),
      new Set([...line.substring(middle)]),
    ];
  });
  const dupItems = uniqueCompartmentContents.map((comps) => findDup(comps));
  const prioritySum = sum(dupItems.map(itemPriority));
  logAndAssert(prioritySum, 157);

  // Part 2
  const groups = _.chunk(input.split("\n"), 3).map((group) =>
    group.map((contents) => new Set([...contents]))
  );
  const badges = groups.map(findDup);
  const badgePrioritySum = sum(badges.map(itemPriority));
  logAndAssert(badgePrioritySum, 70);
};

main();
