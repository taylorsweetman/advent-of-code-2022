import { logAndAssert, readInput } from "../../ts_lib";
import _ from "lodash";

type Monkey = {
  idx: number;
  startItems: number[];
  operation: string;
  testDiv: number;
  trueAct: number;
  falseAct: number;
  numberOfInspections: number;
};

type Operator = "+" | "*";

const getNumberFromLine = (line: string) =>
  parseInt(line.match(/\d+/)?.[0] ?? "-1");

const getNumbersFromLine = (line: string) =>
  line.match(/\d+/g)?.map((num) => parseInt(num)) ?? [];

const parse = (input: string): Record<number, Monkey> => {
  const paragraphs = input.split("\n\n");
  const linesByParagraph = paragraphs.map((para) =>
    para.split("\n").map((line) => line.trim())
  );
  const monkeys = linesByParagraph.map((text) => {
    return text.reduce(
      (acc, current, i) => {
        if (i === 0) {
          return { ...acc, idx: getNumberFromLine(current) };
        }

        if (i === 1) {
          return {
            ...acc,
            startItems: getNumbersFromLine(current),
          };
        }

        if (i === 2) {
          return {
            ...acc,
            operation: current.substring(current.indexOf("=") + 2),
          };
        }

        if (i === 3) {
          return {
            ...acc,
            testDiv: getNumberFromLine(current),
          };
        }

        if (i === 4) {
          return {
            ...acc,
            trueAct: getNumberFromLine(current),
          };
        }

        if (i === 5) {
          return { ...acc, falseAct: getNumberFromLine(current) };
        }

        return acc;
      },
      { numberOfInspections: 0 } as Monkey
    );
  });

  return monkeys;
};

const findReliefValue = (num: number) => Math.floor(num / 3);

const findWorryValue = (formula: string, val: number): number => {
  const withValInserted = formula
    .split(" ")
    .map((part) => (part === "old" ? val : part));

  const parsedFormula: { left: number; op: Operator; right: number } = {
    left: Number(withValInserted[0]),
    op: withValInserted[1] as Operator,
    right: Number(withValInserted[2]),
  };

  if (parsedFormula.op === "+") return parsedFormula.left + parsedFormula.right;

  return parsedFormula.left * parsedFormula.right;
};

const runMonkey = (
  all: Record<number, Monkey>,
  currentIdx: number
): Record<number, Monkey> => {
  const after = all[currentIdx].startItems.reduce((acc, currentItem) => {
    const thrownFrom: Monkey = acc[currentIdx];
    const worryUp = findWorryValue(thrownFrom.operation, currentItem);
    const worryDown = findReliefValue(worryUp);
    const thrownTo =
      worryDown % thrownFrom.testDiv === 0
        ? acc[thrownFrom.trueAct]
        : acc[thrownFrom.falseAct];

    return {
      ...acc,
      [thrownTo.idx]: {
        ...thrownTo,
        startItems: [...thrownTo.startItems, worryDown],
      },
      [thrownFrom.idx]: {
        ...thrownFrom,
        numberOfInspections: thrownFrom.numberOfInspections + 1,
        startItems: thrownFrom.startItems.slice(1),
      },
    };
  }, all);

  return after;
};

const runRound = (all: Record<number, Monkey>): Record<number, Monkey> =>
  Object.values(all).reduce((acc, current) => runMonkey(acc, current.idx), all);

const runRounds = (
  num: number,
  monkeys: Record<number, Monkey>
): Record<number, Monkey> => {
  if (num === 0) return monkeys;
  return runRounds(num - 1, runRound(monkeys));
};

const main = () => {
  const monkeys = parse(readInput(__dirname));
  const result = runRounds(20, monkeys);
  const mostActive = _.orderBy(
    Object.values(result),
    "numberOfInspections",
    "desc"
  ).slice(0, 2);
  const monkeyBusiness = mostActive.reduce(
    (acc, current) => acc * current.numberOfInspections,
    1
  );
  logAndAssert(monkeyBusiness, 10_605);
};

main();
