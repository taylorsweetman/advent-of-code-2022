import { readFileSync } from "fs";
import { logAndAssert } from "../../ts_lib";

const initialStateToCsv = (rawInitialState: string) =>
  rawInitialState
    .replace(/^\s{4}/g, "[ ] ")
    .replace(/\s{4}/g, " [ ]")
    .replace(/\][ \t]/g, "],");

const parseInitialState = (
  csvInitialState: string
): Record<number, string[]> => {
  const crateLines = csvInitialState
    .split("\n")
    .slice(0, -1)
    .map((line) => line.split(",").map((str) => str.substring(1, 2)));

  return crateLines.reduce((acc, line) => {
    line.forEach((element, idx) => {
      if (element !== " " && acc[idx + 1]) acc[idx + 1].unshift(element);
      else if (element !== " ") acc[idx + 1] = [element];
    });
    return acc;
  }, {} as Record<number, string[]>);
};

const parseInstructions = (
  rawInstructions: string
): [number, number, number][] => {
  const lines = rawInstructions.split("\n");
  return lines.map((line) => {
    const matches = line.matchAll(/\d+/g);
    return [
      parseInt(matches.next().value[0]),
      parseInt(matches.next().value[0]),
      parseInt(matches.next().value[0]),
    ];
  });
};

// TODO: remove the mutations
const moveCratesOne = (
  initalState: Record<number, string[]>,
  instructions: [number, number, number][]
) => {
  const finalState = instructions.reduce((acc, [amt, from, to]) => {
    while (amt > 0) {
      const crate = acc[from].pop() ?? "";
      acc[to] ? acc[to].push(crate) : (acc[to] = [crate]);
      amt--;
    }
    return acc;
  }, initalState);
  return finalState;
};

// TODO: remove the mutations
const moveCratesTwo = (
  initalState: Record<number, string[]>,
  instructions: [number, number, number][]
) => {
  const finalState = instructions.reduce((acc, [amt, from, to]) => {
    const movedCrates = acc[from].splice(-amt);
    acc[to] ? acc[to].push(...movedCrates) : (acc[to] = movedCrates);
    return acc;
  }, initalState);
  return finalState;
};

const topOfStackStr = (finalState: Record<number, string[]>) =>
  Object.values(finalState)
    .map((stack) => stack.pop())
    .join("");

const main = () => {
  const input = readFileSync("../input.txt", "utf8");
  const [rawInitialState, rawInstructions] = input.split("\n\n");

  const instructionTuples = parseInstructions(rawInstructions);

  // Part 1
  const initialStateMapOne = parseInitialState(
    initialStateToCsv(rawInitialState)
  );
  const finalStateOne = moveCratesOne(initialStateMapOne, instructionTuples);
  const topsOne = topOfStackStr(finalStateOne);
  logAndAssert(topsOne, "CMZ");

  // Part 2
  const initialStateMapTwo = parseInitialState(
    initialStateToCsv(rawInitialState)
  );
  const finalStateTwo = moveCratesTwo(initialStateMapTwo, instructionTuples);
  const topsTwo = topOfStackStr(finalStateTwo);
  logAndAssert(topsTwo, "MCD");
};

main();
