import { logAndAssert, readInput } from "../../ts_lib";
import _ from "lodash";

type Monkey = {
  idx: number;
  startItems: bigint[];
  operation: string;
  testDiv: bigint;
  trueAct: number;
  falseAct: number;
  numberOfInspections: number;
};

type Operator = "+" | "*";

const getBigIntFromLine = (line: string) =>
  BigInt(line.match(/\d+/)?.[0] ?? "-1");

const getNumFromLine = (line: string) => Number(line.match(/\d+/)?.[0] ?? "-1");

const getBigIntsFromLine = (line: string) =>
  line.match(/\d+/g)?.map((num) => BigInt(num)) ?? [];

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
            startItems: getBigIntsFromLine(current),
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
            testDiv: getBigIntFromLine(current),
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

const findReliefValue = (num: bigint, _: bigint) =>
  BigInt(Math.floor(Number(num) / 3));

const findReliefVauleTwo = (num: bigint, div: bigint) => div + (num % div);

const findWorryValue = (formula: string, val: bigint): bigint => {
  const withValInserted = formula
    .split(" ")
    .map((part) => (part === "old" ? val : part));

  const parsedFormula: { left: bigint; op: Operator; right: bigint } = {
    left: BigInt(withValInserted[0]),
    op: withValInserted[1] as Operator,
    right: BigInt(withValInserted[2]),
  };

  if (parsedFormula.op === "+") return parsedFormula.left + parsedFormula.right;

  return parsedFormula.left * parsedFormula.right;
};

const runMonkey = (
  all: Record<number, Monkey>,
  currentIdx: number,
  worryReducer: (num: bigint, div: bigint) => bigint
): Record<number, Monkey> => {
  const divisor = Object.values(all).reduce(
    (acc, current) => acc * current.testDiv,
    BigInt(1)
  );
  const after = all[currentIdx].startItems.reduce((acc, currentItem) => {
    const thrownFrom: Monkey = acc[currentIdx];
    const worryUp = findWorryValue(thrownFrom.operation, currentItem);
    const worryDown = worryReducer(worryUp, divisor);
    const thrownTo =
      worryDown % thrownFrom.testDiv === BigInt(0)
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

const runRound = (
  all: Record<number, Monkey>,
  worryReducer: (num: bigint, div: bigint) => bigint
): Record<number, Monkey> =>
  Object.values(all).reduce(
    (acc, current) => runMonkey(acc, current.idx, worryReducer),
    all
  );

const runRounds =
  (worryReducer: (num: bigint, div: bigint) => bigint) =>
  (num: number, monkeys: Record<number, Monkey>): Record<number, Monkey> => {
    let current = monkeys;
    while (num > 0) {
      current = runRound(current, worryReducer);
      num--;
    }
    return current;
  };

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
