import { logAndAssert, readInput } from "../../ts_lib";
import _ from "lodash";

type Monkey = {
  idx: number;
  startItems: number[];
  operation: string;
  testDiv: number;
  trueAct: number;
  falseAct: number;
};

const getNumberFromLine = (line: string) =>
  parseInt(line.match(/\d+/)?.[0] ?? "-1");

const getNumbersFromLine = (line: string) =>
  line.match(/\d+/g)?.map((num) => parseInt(num)) ?? [];

const parse = (input: string): Monkey[] => {
  const paragraphs = input.split("\n\n");
  const linesByParagraph = paragraphs.map((para) =>
    para.split("\n").map((line) => line.trim())
  );
  const monkeys = linesByParagraph.map((text) => {
    return text.reduce((acc, current, i) => {
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
    }, {} as Monkey);
  });

  return monkeys;
};

const main = () => {
  const monkeys = parse(readInput(__dirname));
  console.log(JSON.stringify(monkeys));
};

main();
