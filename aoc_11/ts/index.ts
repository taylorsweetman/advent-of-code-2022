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

type ReducerFunc = (num: number, div: number) => number;

const getNumFromLine = (line: string) => Number(line.match(/\d+/)?.[0] ?? "-1");

const getNumsFromLine = (line: string) =>
  line.match(/\d+/g)?.map((num) => Number(num)) ?? [];

const parse = (input: string): Record<number, Monkey> => {
  const paragraphs = input.split("\n\n");
  const linesByParagraph = paragraphs.map((para) =>
    para.split("\n").map((line) => line.trim())
  );
  const monkeys = linesByParagraph.map((text) => {
    return text.reduce(
      (acc, current, i) => {
        if (i === 0) {
          return { ...acc, idx: getNumFromLine(current) };
        }
        if (i === 1) {
          return {
            ...acc,
            startItems: getNumsFromLine(current),
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
            testDiv: getNumFromLine(current),
          };
        }
        if (i === 4) {
          return {
            ...acc,
            trueAct: getNumFromLine(current),
          };
        }
        if (i === 5) {
          return { ...acc, falseAct: getNumFromLine(current) };
        }
        return acc;
      },
      { numberOfInspections: 0 } as Monkey
    );
  });

  return monkeys;
};

const findReliefValue: ReducerFunc = (num, _) => Math.floor(num / 3);

const findReliefVauleTwo: ReducerFunc = (num, div) => div + (num % div);

const findWorryValue = (formula: string, val: number): number =>
  eval(
    formula
      .split(" ")
      .map((part) => (part === "old" ? String(val) : part))
      .join("")
  );

const runMonkey =
  (worryReducer: ReducerFunc) =>
  (all: Record<number, Monkey>, currentIdx: number): Record<number, Monkey> => {
    const divisor = Object.values(all).reduce(
      (acc, current) => acc * current.testDiv,
      1
    );
    return all[currentIdx].startItems.reduce((acc, currentItem) => {
      const thrownFrom: Monkey = acc[currentIdx];
      const worryUp = findWorryValue(thrownFrom.operation, currentItem);
      const worryDown = worryReducer(worryUp, divisor);
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
  };

const runRound =
  (worryReducer: ReducerFunc) =>
  (all: Record<number, Monkey>): Record<number, Monkey> =>
    Object.values(all).reduce(
      (acc, current) => runMonkey(worryReducer)(acc, current.idx),
      all
    );

const runRounds =
  (worryReducer: (num: number, div: number) => number) =>
  (num: number, monkeys: Record<number, Monkey>): Record<number, Monkey> =>
    _.range(num).reduce(runRound(worryReducer), monkeys);

const main = () => {
  const monkeys = parse(readInput(__dirname));

  // Part 1
  const roundOneRunner = runRounds(findReliefValue);
  const result = roundOneRunner(20, monkeys);
  const mostActive = _.orderBy(
    Object.values(result),
    "numberOfInspections",
    "desc"
  ).slice(0, 2);
  const monkeyBusiness = mostActive.reduce(
    (acc, current) => acc * current.numberOfInspections,
    1
  );
  logAndAssert(monkeyBusiness, 100_345);

  // Part 2
  const roundTwoRunner = runRounds(findReliefVauleTwo);
  const resultTwo = roundTwoRunner(10_000, monkeys);
  const mostActiveTwo = _.orderBy(
    Object.values(resultTwo),
    "numberOfInspections",
    "desc"
  ).slice(0, 2);
  const monkeyBusinessTwo = mostActiveTwo.reduce(
    (acc, current) => acc * current.numberOfInspections,
    1
  );
  logAndAssert(monkeyBusinessTwo, 28_537_348_205);
};

main();
