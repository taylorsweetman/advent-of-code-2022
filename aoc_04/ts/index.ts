import { readFileSync } from "fs";
import { logAndAssert } from "../../js_lib";

const fullyContained = (
  [lStart, lEnd]: [number, number],
  [rStart, rEnd]: [number, number]
) => (lStart <= rStart && lEnd >= rEnd) || (rStart <= lStart && rEnd >= lEnd);

const isBetweenPoints = (num: number, [start, end]: [number, number]) =>
  num >= start && num <= end;

const overlaps = (l: [number, number], r: [number, number]) => {
  const [lStart, lEnd] = l;
  const [rStart, rEnd] = r;
  return (
    isBetweenPoints(lStart, r) ||
    isBetweenPoints(lEnd, r) ||
    isBetweenPoints(rStart, l) ||
    isBetweenPoints(rEnd, l)
  );
};

const main = () => {
  const input = readFileSync("../input.txt", "utf8");
  const pairs = input
    .split("\n")
    .map((line) =>
      line
        .split(",")
        .map((assignment) => assignment.split("-").map((num) => parseInt(num)))
    ) as [number, number][][];

  // Part 1
  const fullOverlaps = pairs.filter(([l, r]) => fullyContained(l, r));
  logAndAssert(fullOverlaps.length, 2);

  // Part 2
  const anyOverlaps = pairs.filter(([l, r]) => overlaps(l, r));
  logAndAssert(anyOverlaps.length, 4);
};

main();
